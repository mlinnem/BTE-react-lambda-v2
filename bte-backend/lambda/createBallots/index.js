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

  t("Prepare to write new pending ballots to backend.", 1);
  var writeNewBallotsPromise = makeWriteNewBallotsStatement(authKey, newBallots, ipAddress);

  t("Write pending ballots to backend, and confirm it worked", 1);
  var writeResult;
  [writeResult] = await Promise.all([writeNewBallotsPromise]);

  t("Return pending ballots.", 1);
  return makeResponse(newBallots);
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


function makeWriteNewBallotsStatement(authKey, pendingBallots, sessionData, ipAddress) {
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
      putRequests.push(putRequest);
    }

    var batchWrite_params = {
      RequestItems: {
          'PendingBallots': putRequests
      }
    };

      t("request:", 2);
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
                 var ballot = {"Animal1ID " : rankings[animal_1_num], "Animal2ID" : rankings[animal_2_num]};
                  const uniqueID = getUniqueID();
                  ballot.ID = PENDINGBALLOTID_PREFIX + uniqueID;
                  newBallots.push(ballot);
                  t("New ballots is now", 2);
                  t(newBallots, 2);
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

function t(message, indention = 0) {
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
