var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var io = new AWS.DynamoDB.DocumentClient({
apiVersion: '2018-10-01'
});

exports.handler = async (event, context, callback) => {
  var ballots = event.Records;
  await processBallots(ballots);
}

async function processBallots(ballots) {
  //TODO: Change to pull all messages off queue every 10 seconds or minute.

  var animalUpdates = {};
  var matchupUpdates = {};

  console.log("For each ballot...");
  for (let ballot of ballots) {

    var winner = parseInt(ballot.messageAttributes.Winner.stringValue);
    var loser = parseInt(ballot.messageAttributes.Loser.stringValue);

    console.log("    Record new wins for winning animal");
    animalUpdates = recordWin(animalUpdates, winner);
    console.log("    Record new losses for losing animal");
    animalUpdates = recordLoss(animalUpdates, loser);
    console.log("    Record wins for winner in pairing of winner, loser (lower ID first.)");
    var matchupID = constructMatchupID(winner, loser);
    matchupUpdates = recordMatchWin(matchupUpdates, matchupID, winner);
  }

  var animalUpdateStatements = [];

  console.log("For each changed animal...");
  for (let animalID of Object.keys(animalUpdates)) {
    var animalUpdate = animalUpdates[animalID];

    console.log("    Plan to increment wins and losses");
    var animalUpdateStatement = makeAnimalUpdateStatement(animalUpdate, animalID);
    animalUpdateStatements.push(animalUpdateStatement);
  }

  console.log("For each changed matchup...");
  for (let matchupID of Object.keys(matchupUpdates)) {
    var matchupUpdate = matchup[matchupID];

    console.log("    Plan to increment wins for winning animal");
    var matchupUpdateStatement = makeMatchupUpdateStatement(matchupUpdate, matchupID);
    matchupUpdateStatements.push(animalUpdateStatement);
  }

  console.log("For animals & matchups, write planned changes.");
  await backend_writeAllUpdates(animalUpdateStatements, matchupUpdateStatement);
}


function recordWin(animalUpdates, winner) {
  var animalUpdate = animalUpdates[winner];
  if (animalUpdate) {
    animalUpdate.Wins = animalUpdate.Wins + 1;
  } else {
    animalUpdate.Wins = 1;
  }

  animalUpdates[winner] = animalUpdate;
  return animalUpdates;
}

function recordLoss(animalUpdates, loser) {
  var animalUpdate = animalUpdates[loser];
  if (animalUpdate) {
    animalUpdate.Losses = animalUpdate.Losses + 1;
  } else {
    animalUpdate.Losses = 1;
  }

  animalUpdates[winner] = animalUpdate;
  return animalUpdates;
}

function constructMatchupID (winner, loser) {
  if (winner <= loser) {
    return winner.toString() + "_" + loser.toString();
  } else {
      return loser.toString() + "_" + winner.toString();
  }
}

function recordMatchWin(matchUpdates, matchupID, winner, loser) {
  var matchUpdate = matchUpdate[matchupID];
  var winnerPlace = null;
  var loserPlace = null;

  if (matchupID.startsWith(winner.toString()) {
    winnerPlace = "Animal1Wins";
    loserPlace = "Animal2Wins";
  } else {
    winnerPlace = "Animal2Wins";
    loserPlace = "Animal1Wins";
  }

  if (matchUpdate) {
    animalUpdate[animalPlace] = animalUpdate[animalPlace] + 1;
  } else {
    animalUpdate[winnerPlace] = 1;
    animalUpdate[loserPlace] = 0;
  }

  matchUpdates[matchupID] = animalUpdate;
  return matchUpdates;
}

function makeAnimalUpdateStatement(animalUpdate, animalID) {
  var updateParam = {
  "TableName": "Animals",
  "Key": {
    "ID": animalID,
  },
  "UpdateExpression": 'ADD Wins :w_inc, Losses :l_inc',
  "ExpressionAttributeValues": {
    ":w_inc": animalUpdate.Wins,
    ":l_inc": animalUpdate.Losses,
  };

  return updateParams;
}
function makeMatchupUpdateStatement(matchupUpdate, matchupID) {
  var updateParam = {
  "TableName": "Matchups",
  "Key": {
    "ID": matchupID,
  },
  "UpdateExpression": 'ADD Animal1Wins :one_inc, Animal2Wins :two_inc',
  "ExpressionAttributeValues": {
    ":one_inc": matchupUpdate.Animal1Wins,
    ":two_inc": matchupUpdate.Animal2Wins,
  };

  return updateParams;
}

//--BACKEND--

function backend_writeAllUpdates(animalUpdateStatements, matchupUpdateStatements) {
  var statements = animalUpdateStatements.concat(matchupUpdateStatements);
  var promises = statements.map((statement) => {return io.update(statement).promise()});
  return Promise.all(promises);
}
