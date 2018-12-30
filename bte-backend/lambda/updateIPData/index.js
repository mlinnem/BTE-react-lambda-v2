
const u = require("./c_utilityFunctions");

const SHADOW_BANNED = "SHADOW_BANNED";
const SHADOWBAN_SUBMISSION_THRESHOLD = 900
const ACCEPTABLE_ABANDON_RATE = .8;
const ACCEPTABLE_CONTRARIAN_RATE = .8;
const WATCH_LISTED = "WATCH_LISTED";
const BALLOT_ABANDONER = "BALLOT_ABANDONER";
const CONTRARIAN = "CONTRARIAN";

//{ Records:
//[ { EventSource: 'aws:sns',
//EventVersion: '1.0',
//EventSubscriptionArn: 'arn:aws:sns:us-east-1:395179212559:successfulBallotSubmission:d8ee0c84-2baf-4cc0-a826-6bdb11561b2d',
//Sns: [Object] } ] }

//{ Type: 'Notification',
//MessageId: 'f6b3ff52-c254-512c-8026-ab2cd836d1c6',
//TopicArn: 'arn:aws:sns:us-east-1:395179212559:successfulBallotSubmission',
//Subject: null,
//Message: '{"SessionID":"5U2v+PDvHYbOSGruh1RNgZ/S8OLyJ6Ms","IPAddress":"70.115.134.72","WinnerID":0,"LoserID":1}',
//Timestamp: '2018-12-02T17:36:34.774Z',
//SignatureVersion: '1',
//Signature: 'T0e5+j1JtcUjlF3MGaGGDKTgCT9FzwLL0kDoaSsdqeZU0gMOqnOOv09nOtbHq5N+cynKte9BbEv7YWHeuUEnxZ3oAGAerOptoH8SnZ5RIPzDqwoY4nz+eis+K+IiZLWYvLH3W/QyN61+oJooRYibcZ8fiXUyW+MvmASVULaXTt54lW6bL8Xuy/DVcC7u2b+BooRjLP9N2Pbcjix16ieQVP7FymHGGzcT5T5Jaz8O11bltZ5MHWcW7wxVocZAetRXBFC3bkQXrwxijKAFa52tf3Ck76C2t7hByUkpiNOv2T+TJBCzs2brAujZfxhT5vONfrApDRvymAvEvuCn6RxYfQ==',
//SigningCertUrl: 'https://sns.us-east-1.amazonaws.com/SimpleNotificationService-ac565b8b1a6c5d002d285f9598aa1d9b.pem',
//UnsubscribeUrl: 'https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:395179212559:successfulBallotSubmission:d8ee0c84-2baf-4cc0-a826-6bdb11561b2d',
//MessageAttributes: {} }

var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'us-east-1'
});
var io = new AWS.DynamoDB.DocumentClient({
apiVersion: '2018-10-01'
});

//TODO: Make sure bogus ballots aren't triggering this process.
exports.handler = async (event) => {
    // TODO implement
    console.log("MAIN")
    console.log("event:");
    console.log(event);
    var sns = event.Records[0].Sns;
    console.log("sns:");
    console.log(sns);
    var message = JSON.parse(sns.Message);
    console.log("message:");
    console.log(message);

    var ipAddress = message.IPAddress;
    var winnerID = message.WinnerID;
    var loserID = message.LoserID;

    await updateIPData(ipAddress, winnerID, loserID);

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};


async function updateIPData(ipAddress, winnerID, loserID) {

    var ipData = await backend_getIPData(ipAddress);
    console.log("ip Data:");
    console.log(ipData);

    if (ipData.ParanoiaLevel == SHADOW_BANNED) {
        console.log("Don't spend any more compute power on this shadowbanned scum! Exiting");
        return;
    }

    //If not on watch list
    if (ipData.ParanoiaLevel != SHADOW_BANNED && ipData.ParanoiaLevel != WATCH_LISTED) {
        //Just implement submissionCount
        console.log("NOTHING SPECIAL. INCREMENTING SUBMISSION COUNT");
        await backend_updateForNormalIP(ipAddress); //TODO: Can this be done in parallel with other stuff?
        var watchlistReasonOrNull = getWatchListReasonOrNull(ipData);
        if (watchlistReasonOrNull) {
          console.log("Should add to watch list! :" + watchlistReasonOrNull);
          await backend_addToWatchList(ipAddress, watchlistReasonOrNull);
        } else {
           t.o("No reason to add to watchlist", 2);
         }

        return null;
    }

    if (ipData.ParanoiaLevel == WATCH_LISTED) {
        await backend_updateForWatchlistedIP(ipAddress);

        var reason = getShadowbanReasonOrNull(ipData);
        if (reason != null) {
            if (ipData.Submissions > SHADOWBAN_SUBMISSION_THRESHOLD) {
                 console.log("Face my shadowban fool!");
                 await backend_addToShadowbanList(ipAddress, reason);
            } else {
                console.log("You would be banned, but overall submissions isn't high enough yet. Just you wait!");
            }
        } else {
            console.log("No cause to shadowban. Stay above the law citizen.");
        }
    }
    //If already on watch list
        //Plan to increment submissionCount contrarian or non-contrarian count, and non-abandoned ballot count.

    //Increment what needs incrementing, and get new results.

    //If not on watch list
        //If meet criteria for watch list
            //Add to watch list.
    //Else
        //If meet criteria
            //Add to shadowban list.


}

function backend_getIPData(ipAddress) {
  var get_params = {
  Key: {
   "IPAddress": ipAddress
  },
  TableName: "IPData"
 };

 return io.get(get_params).promise()
 .then((ipData) => {
   console.log("GOT IP Data");
   console.log(ipData);
   return ipData.Item;
 });
}

function backend_updateForNormalIP(ipAddress) {
    var updateParams = {
    "TableName": "IPData",
    "Key": {
      "IPAddress": ipAddress
    },
    "UpdateExpression": 'ADD Submissions :s_inc',
    "ExpressionAttributeValues": {
      ":s_inc": 1,
    },
  };

  return io.update(updateParams).promise()
  .then((result) => {
      console.log("result of update:");
      console.log(result);
  })
  .catch((error) => {
      console.log("Error on update!");
      console.log(error);
  });
}

function backend_updateForWatchlistedIP(ipAddress) {
    var updateParams = {
    "TableName": "IPData",
    "Key": {
      "IPAddress": ipAddress
    },
    "UpdateExpression": 'ADD Submissions :s_inc, NonAbandonedBallotCount :s_inc',
    "ExpressionAttributeValues": {
      ":s_inc": 1,
    },
  };

  return io.update(updateParams).promise()
  .then((result) => {
      console.log("result of update:");
      console.log(result);
  })
  .catch((error) => {
      console.log("Error on update!");
      console.log(error);
  });
}

function backend_addToWatchList(ipAddress, reason) {
    var updateParams = {
    "TableName": "IPData",
    "Key": {
      "IPAddress": ipAddress
    },
    "UpdateExpression": 'SET ParanoiaLevel = :watchlisted, Reason = :reason',
    "ExpressionAttributeValues": {
      ":watchlisted": WATCH_LISTED,
      ":reason" : reason
    },
  };

    console.log("update params:");
    console.log(updateParams);
  return io.update(updateParams).promise()
  .then((result) => {
      console.log("result of update:");
      console.log(result);
  })
  .catch((error) => {
      console.log("Error on update!");
      console.log(error);
  });
}

function backend_addToShadowbanList(ipAddress) {
    var updateParams = {
    "TableName": "IPData",
    "Key": {
      "IPAddress": ipAddress
    },
    "UpdateExpression": 'set ParanoiaLevel = :shadowbanned',
    "ExpressionAttributeValues": {
      ":shadowbanned": SHADOW_BANNED,
    },
  };

  return io.update(updateParams).promise()
  .then((result) => {
      console.log("result of update:");
      console.log(result);
  })
  .catch((error) => {
      console.log("Error on update!");
      console.log(error);
  });
}

const WATCHLIST_THRESHOLD = 450;

function getWatchListReasonOrNull(ipData) {
    if (ipData.ParanoiaLevel == SHADOW_BANNED) {
      u.t("Already shadowbanned", 2);
      return null;
    } else if (ipData.ParanoiaLevel == WATCH_LISTED) {
      u.t("Already watchListed", 2);
        return null;
    } else {
        var overWatchlistThreshold = ipData.Submissions > WATCHLIST_THRESHOLD;
        if (overWatchlistThreshold) {
          return "Lots of submitted ballots";
        }
        return null;
    }
}

function getShadowbanReasonOrNull(ipData) {
  var ballotAbandoner = shouldBanForBallotAbandoning(ipData);
  if (ballotAbandoner) {
      return BALLOT_ABANDONER;
  } else {
      return null;
  }
}

function shouldBanForBallotAbandoning(ipData) {
    var abandonedBallotCount = ipData.AbandonedBallotCount;
    var nonAbandonedBallotCount = ipData.NonAbandonedBallotCount;

    console.log("[abandonedBallots]:");
    console.log(abandonedBallotCount);
    console.log("[nonAbandonedBallots]:");
    console.log(nonAbandonedBallotCount);
    if (!(abandonedBallotCount && nonAbandonedBallotCount)) {
        console.log("No abandonedBallots, or no nonAbandonedBallots.");
        return false;
    }

    var totalBallotsTracked = abandonedBallotCount + nonAbandonedBallotCount;
    var abandonRate = abandonedBallotCount / totalBallotsTracked;

    if (abandonRate > ACCEPTABLE_ABANDON_RATE) {
        console.log("Too many abandoned ballots. BAN!");
        console.log("abandon rate:");
        console.log(abandonRate);
        return true;
    } else {
        console.log("Abandonment Rate not high enough. Good for now.");
        console.log("abandon rate:");
        console.log(abandonRate);
        return false;
    }
}
