const u = require("c_utilityFunctions");

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const crypto = require("crypto");

const MAX_PENDING_BALLOTS = 15;
const PENDINGBALLOTID_PREFIX = "ballot_";


var io = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-10-01'});

exports.handler = (event) => {
    t("Parsing event", 1);
    t_o(event);

    var authKey = event["queryStringParameters"]['authkey'];
    var ipAddress = event['requestContext']['identity']['sourceIp'];

    console.log("authKey");
    console.log(authKey);
    return createBallots(authKey, ipAddress);
};

//--Main--

async function createBallots(authKey, ipAddress) {

  t("Prepare to get all the session data for this authKey.", 1);
  var getSessionDataPromise = backend_getSessionData(authKey);

  t("Prepare to get animal rankings.", 1);
  var getAnimalRankingsPromise = backend_getAnimalRankings();

  t("Get session data and animal rankings.", 1);
  var sessionData, animalRankings;
  [sessionData, animalRankings] = await Promise.all([getSessionDataPromise, getAnimalRankingsPromise]);

  t("Short circuit if authkey is not legit.", 1);
  if (sessionData.length == 0) {
    throw "Naughty naughty";
    //TODO: This should probably be logged as a security issue.
  }

  t("Generate new ballots.", 1);
  var newBallots = generateNewBallots(animalRankings, sessionData);

  t("Get matchup data for each ballot", 1);
  var matchupData = await backend_getMatchupData(newBallots);

  t("Merge matchup data into ballots", 1);
  var newAnnotatedBallots = mergeMatchupDataIntoBallots(newBallots, matchupData);

  t("Prepare to write new pending ballots to backend.", 1);
  var writeNewBallotsPromise = makeWriteNewBallotsStatement(authKey, newAnnotatedBallots, ipAddress);

  t("Write pending ballots to backend, and confirm it worked", 1);

  var [writeResult] = await Promise.all([writeNewBallotsPromise]);

  u.t("response:");
  u.t_o(writeResult);

  t("Return pending ballots.", 1);
  return makeResponse(newAnnotatedBallots);
}

//--LOGIC--

function determineNewBallotsNeeded(sessionData) {
  var ballotsPending = 0;
  var keys = Object.keys(sessionData);
  for (let key of keys) {
    var sessionRecord = sessionData[key];
    if (sessionRecord.PendingBallotID.startsWith(PENDINGBALLOTID_PREFIX)) {
      ballotsPending = ballotsPending + 1;
    }
  }

  return MAX_PENDING_BALLOTS - ballotsPending;
}


function makeWriteNewBallotsStatement(authKey, pendingBallots, ipAddress) {
    var putRequests = [];
    for (var pendingBallot of pendingBallots) {
      var putRequest = {
        PutRequest: {
          Item: {
            SessionID: authKey,
            PendingBallotID: pendingBallot.ID,
            Animal1ID: pendingBallot.Animal1ID,
            Animal2ID: pendingBallot.Animal2ID,
            CreatedAt: getCurrentTime_InEpochSecondsFormat(),
            IPAddress: ipAddress
          }
        }
      };

      t("individual request:", 2);
      t_o(putRequest);
      putRequests.push(putRequest);
    }

    var batchWrite_params = {
      RequestItems: {
          'PendingBallots': putRequests
      }
    };

      t("overall request:", 2);
      t_o(batchWrite_params);
    return io.batchWrite(batchWrite_params).promise()
    .then((result) => {
      console.log("result:");
      console.log(result);
      return result; //TODO: Determine if it fails or not and return?
    });
  }

function generateNewBallots(rankings, sessionData) {
      var newBallotsNeeded = determineNewBallotsNeeded(sessionData);

      var newBallots = [];
          for (var i=0; i < newBallotsNeeded; i++) {
              t("I is " + i, 2);
              var animal_1_num = 0;
              var animal_2_num = 0;
              animal_1_num = getRandomInt(0, rankings.length - 1);
              if (animal_1_num > 0) {
                  animal_2_num = animal_1_num - 1;
              } else {
                  animal_2_num = animal_1_num + 1;
              }
              if (coinFlip()) {
                  //SWAP
                  var temp = animal_1_num;
                  animal_1_num = animal_2_num;
                  animal_2_num = temp;
                }
                 var ballot = {"Animal1ID" : rankings[animal_1_num], "Animal2ID" : rankings[animal_2_num]};
                  const uniqueID = getUniqueID();
                  ballot.ID = PENDINGBALLOTID_PREFIX + uniqueID;
                  newBallots.push(ballot);
                 }
     return newBallots;
}

function makeResponse(ballots) {
    console.log("Outgoing response...");
      const response = {
          "statusCode": 200,
          "isBase64Encoded": false,
          "headers": {"Access-Control-Allow-Headers": '*',
                    "Access-Control-Allow-Origin": '*',
                    "Access-Control-Allow-Methods": '*' },
          "body": JSON.stringify(ballots),
      };
      console.log(response);
      return response;
}

//Note: This also has a side-effect of eliminating duplicate ballots (identical, or with different order but same animals), for better or worse.
function mergeMatchupDataIntoBallots(ballots, matchupData) {
  //index ballots by their PairID, and also kill ballots that are redundant.
  var ballotsByPairID = {};
  for (ballot of ballots) {
    var pairID = u.constructMatchupID(ballot.Animal1ID, ballot.Animal2ID);
    ballotsByPairID[pairID] = ballot;

    //(give each ballot an empty set of matchup data to cover the case where none exists yet.)
    ballotsByPairID[pairID].MatchupData =
      {
        "Animal1Wins" : 0,
        "Animal2Wins" : 0
    };
  }
  t("ballotsByPairID:");
  t_o(ballotsByPairID);

  t("for each matchup...", 2);
 for (const [matchupKey, matchup] of Object.entries(matchupData)) {
    //annotate ballots with their associated matchup data
    t("matchup:", 3);
    t_o(matchup);

    var correspondingBallot = ballotsByPairID[matchup.IDPair];
    if (correspondingBallot) {
      var animal1ID = u.extractAnimal1ID_from_matchupID(matchup.IDPair);
      var ballotAnimal1ID = correspondingBallot.Animal1ID;
      if (animal1ID == ballotAnimal1ID) {
        u.t("Wins were not flipped.", 3);
        //The ID creation process didn't flip the IDs. Proceed.
        ballotsByPairID[matchup.IDPair].MatchupData = {
          "Animal1Wins" : matchup.Animal1Wins,
          "Animal2Wins" : matchup.Animal2Wins
        };
      } else {
        //The ID creation process flipped the IDs. Flip the wins.
        u.t("Wins were flipped.", 3);
        ballotsByPairID[matchup.IDPair].MatchupData = {
          "Animal1Wins" : matchup.Animal2Wins,
          "Animal2Wins" : matchup.Animal1Wins
        };
      }

    }
  }

  t("ballotsByPairID (annotated):");
  t_o(ballotsByPairID);

  //convert ballots back into an array
  var annotatedBallots = [];
  var ballotKeys = Object.keys(ballotsByPairID);
  for (let ballotKey of ballotKeys) {
    var ballot = ballotsByPairID[ballotKey];
    annotatedBallots.push(ballot);
  }

  t("ballots");
  t_o(annotatedBallots);

  return annotatedBallots;
}


//--BACKEND--

function backend_getAnimalRankings() {
  var get_params = {
  "Key": {
   "Statistic": "Rankings",
  },
  TableName: "SummaryStatistics"
 };
 t("request:", 2);
 t_o(get_params);
 return io.get(get_params).promise().then((result) => {
   t("result:", 2);
   console.log(result);
   return result.Item.Value;
 }).catch((error) => {
   return error;
 });
}

function backend_getSessionData(authKey) {
  var query_params = {
    TableName : 'PendingBallots',
    KeyConditionExpression : "SessionID = :authKey",
    ExpressionAttributeValues : {
        ":authKey" : authKey,
    }
  };

    t("request:", 2);
    t_o(query_params);

  return io.query(query_params).promise()
  .then((result) => {
    t("response:", 2);
    t_o(result);
    return result.Items;
  })
  .catch((error) => {
    t(error);
    return error;
  });
}

//TODO: This could happen a little later (separate function) if return time on createBallots is an issue.
function backend_getMatchupData(ballots) {
  t("for each ballot...", 2);
  var uniqueIDPairs = {};
  for (var ballot of ballots) {
    t("get the idPair", 3);
    var idPair = u.constructMatchupID(ballot.Animal1ID, ballot.Animal2ID);
    t("and if we already have that pair then don't bother remembering this.", 3);
    uniqueIDPairs[idPair] = idPair;
  }

  var keys = [];
  for (var [uniqueIDPairKey, uniqueIDPairValue] of Object.entries(uniqueIDPairs)) {
    var key =
      {
        "IDPair" : uniqueIDPairValue,
      };
    keys.push(key);
  }

  var batchGet_params = {
    RequestItems: {
        'Matchups': {
    "Keys" : keys
        }
    }
  };

    u.t("request:", 2);
    u.t_o(batchGet_params);
    u.t("request keys:");
    u.t_o(batchGet_params.RequestItems.Matchups.Keys);
  return io.batchGet(batchGet_params).promise()
  .then((result) => {
    u.t("result:", 2);
    u.t_o(result);
    return result.Responses.Matchups;
  })
  .catch((error) => {
    u.t_o(error);

    return error;
  });
}

//--Utility functions--

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coinFlip() {
  return Math.random() > .5;
}

function getUniqueID() {
  return crypto.randomBytes(16).toString('base64');
}

function getCurrentTime_InEpochSecondsFormat() {
    return Math.floor((new Date().getTime() / 1000));
}

function t(message, indention) {
  var spacing = "";
  for (let i = 0; i < indention; i++) {
    spacing = spacing + "    ";
  }
  console.log(spacing + message);
}

function t_o(message) {
  //TODO: How to add indentation?
  console.log(message);
}
