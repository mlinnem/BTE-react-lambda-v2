const U = require("c_utilityFunctions");

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var io = new AWS.DynamoDB.DocumentClient({
apiVersion: '2018-10-01'
});

exports.handler = async (event, context, callback) => {
  var ballots = event.Records;
  await processBallots(ballots);
};

async function processBallots(ballots) {
  //TODO: Change to pull all messages off queue every 10 seconds or minute.

  var animalUpdates = {};
  var matchupUpdates = {};

  console.log("For each ballot...");
  for (let ballot of ballots) {

    var winner = parseInt(ballot.messageAttributes.Winner.stringValue, 10);
    var loser = parseInt(ballot.messageAttributes.Loser.stringValue, 10);

    console.log("    Record new wins for winning animal");
    animalUpdates = recordWin(animalUpdates, winner);
    console.log("    Record new losses for losing animal");
    animalUpdates = recordLoss(animalUpdates, loser);
    console.log("    Record wins for winner in pairing of winner, loser (lower ID first.)");
    var matchupID = U.constructMatchupID(winner, loser);
    matchupUpdates = recordMatchWin(matchupUpdates, matchupID, winner);
  }

  var animalUpdateStatements = [];
  var matchupUpdateStatements = [];

  console.log("For each changed animal...");
  for (let animalID of Object.keys(animalUpdates)) {
    var animalUpdate = animalUpdates[animalID];

    console.log("    Plan to increment wins and losses");
    var animalUpdateStatement = makeAnimalUpdateStatement(animalUpdate, animalID);
    animalUpdateStatements.push(animalUpdateStatement);
  }

  console.log("For each changed matchup...");
  for (let matchupID of Object.keys(matchupUpdates)) {
    var matchupUpdate = matchupUpdates[matchupID];

    console.log("    Plan to increment wins for winning animal");
    var matchupUpdateStatement = makeMatchupUpdateStatement(matchupUpdate, matchupID);
    matchupUpdateStatements.push(animalUpdateStatement);
  }

  console.log("For animals & matchups, write planned changes.");
  var writeResults = await backend_writeAllUpdates(animalUpdateStatements, matchupUpdateStatement);

  t("response:", 2);
  t_o(writeResults);
}


function recordWin(animalUpdates, winner) {
  var animalUpdate = animalUpdates[winner];
  if (animalUpdate) {
    animalUpdate.Wins = animalUpdate.Wins + 1;
  } else {
    animalUpdate = {};
    animalUpdate.Wins = 1;
    animalUpdate.Losses = 0;
  }

  animalUpdates[winner] = animalUpdate;
  return animalUpdates;
}

function recordLoss(animalUpdates, loser) {
  var animalUpdate = animalUpdates[loser];
  if (animalUpdate) {
    animalUpdate.Losses = animalUpdate.Losses + 1;
  } else {
    animalUpdate = {};
    animalUpdate.Losses = 1;
    animalUpdate.Wins = 0;
  }

  animalUpdates[loser] = animalUpdate;
  return animalUpdates;
}



function recordMatchWin(matchUpdates, matchupID, winner, loser) {
  var matchUpdate = matchUpdates[matchupID];
  var winnerPlace = null;
  var loserPlace = null;

  if (matchupID.startsWith(winner.toString())) {
    winnerPlace = "Animal1Wins";
    loserPlace = "Animal2Wins";
  } else {
    winnerPlace = "Animal2Wins";
    loserPlace = "Animal1Wins";
  }

  if (matchUpdate) {
    matchUpdate[winnerPlace] = matchUpdate[winnerPlace] + 1;
  } else {
    matchUpdate = {};
    matchUpdate[winnerPlace] = 1;
    matchUpdate[loserPlace] = 0;
  }

  matchUpdates[matchupID] = matchUpdate;
  return matchUpdates;
}

function makeAnimalUpdateStatement(animalUpdate, animalID) {
  var updateParams = {
    "TableName": "Animals",
    "Key": {
      "ID": parseInt(animalID,10),
    },
      "UpdateExpression": 'ADD Wins :w_inc, Losses :l_inc',
      "ExpressionAttributeValues": {
      ":w_inc": animalUpdate.Wins,
      ":l_inc": animalUpdate.Losses,
    }
  };

  t("request:", 2);
  t_o(updateParams);

  return updateParams;
}
function makeMatchupUpdateStatement(matchupUpdate, matchupID) {
  var updateParams = {
  "TableName": "Matchups",
  "Key": {
    "IDPair": matchupID,
  },
  "UpdateExpression": 'ADD Animal1Wins :one_inc, Animal2Wins :two_inc',
  "ExpressionAttributeValues": {
    ":one_inc": matchupUpdate.Animal1Wins,
    ":two_inc": matchupUpdate.Animal2Wins,
    }
  };

  t("request:", 2);
  t_o(updateParams);

  return updateParams;
}

//--BACKEND--

function backend_writeAllUpdates(animalUpdateStatements, matchupUpdateStatements) {
  var statements = animalUpdateStatements.concat(matchupUpdateStatements);
  var promises = statements.map((statement) => {return io.update(statement).promise()});
  return Promise.all(promises);
}

//--UTILITY--

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
