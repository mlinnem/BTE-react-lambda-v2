const Constants = require( "./c_constants");

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var io = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-10-01'});


exports.handler = async (event) => {
    await cleanUpStaleSessions();
};



const TWENTY_FOUR_HOURS_IN_SECONDS = 86400; //Neato!

async function cleanUpStaleSessions() {
    console.log("1) get every session and ballot item whose creation date is 'too old'.");
    var staleSessionsAndBallots = await backend_getStaleSessionsAndBallots(TWENTY_FOUR_HOURS_IN_SECONDS);
    console.log("staleSessionsAndBallots:");
    console.log(staleSessionsAndBallots);

    var ipAddressToStaleBallotCount = {};

    console.log("for each stale item...");
    console.log("Remember to increment that IP address's stale counter by one (if it's a ballot.)");
    for (var staleSessionOrBallot of staleSessionsAndBallots) {

        console.log("[staleSessionOrBallot]:");
        console.log(staleSessionOrBallot);

        if (isBallot(staleSessionOrBallot)) {
            var staleBallot = staleSessionOrBallot;
            var staleBallotIP = staleBallot.IPAddress;
            var existingIPStaleCount = ipAddressToStaleBallotCount[staleBallotIP];
            if (existingIPStaleCount == null) {
                ipAddressToStaleBallotCount[staleBallotIP] = 1;
            } else {
                ipAddressToStaleBallotCount[staleBallotIP] = existingIPStaleCount + 1;
            }
        }

    }

    console.log("[ipAddressToStaleBallotCount]:");
    console.log(ipAddressToStaleBallotCount);

    console.log("Write the new stale/abandoned session IP increments to the backend.");

    var ipAddresses = Object.keys(ipAddressToStaleBallotCount);
    for (var ipAddress of ipAddresses) {
        var staleBallotCount = ipAddressToStaleBallotCount[ipAddress];
        await backend_updateAbandonedBallotCount(ipAddress, staleBallotCount);
    }

    //delete stale items from the table


}

function backend_getStaleSessionsAndBallots(killDataThisFarInThePast) {
    var scanParams = {
  ExpressionAttributeNames: {
   "#PBI": "PendingBallotID",
   "#SI": "SessionID",
   "#IP" : "IPAddress"
  },
  ExpressionAttributeValues: {
   ":tooolddate": getCurrentTime_InEpochSecondsFormat() - killDataThisFarInThePast
  },
  FilterExpression: "CreatedAt <= :tooolddate",
  ProjectionExpression: "#SI, #PBI, #IP",
  TableName: "PendingBallots"
 };

 return io.scan(scanParams).promise()
 .then((result) => {
    return result.Items;
 });
}

function backend_updateAbandonedBallotCount(ipAddress, staleBallotCount) {
     var updateParams = {
    "TableName": "IPData",
    "Key": {
      "IPAddress": JSON.parse(ipAddress)
    },
    "UpdateExpression": 'ADD AbandonedBallotCount :inc',
    "ExpressionAttributeValues": {
      ":inc": staleBallotCount,
    },
    "ConditionalExpression" : "ParanoiaLevel = WATCH_LISTED", //TODO: Make this a common layer constant
  };

  return io.update(updateParams).promise()
  .then((result) => {
      console.log("result of update [success]:");
      console.log(result);
      return result;
  })
  .catch((error) => {
      console.log("Error on update!");
      console.log(error);
  });
}

function getCurrentTime_InEpochSecondsFormat() {
    return Math.floor((new Date().getTime() / 1000));
}

function isBallot(ballotOrSession) {
    return ballotOrSession.PendingBallotID == Constants.SESSION_IDENTIFIER;
}
