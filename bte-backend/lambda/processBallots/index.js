var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

var io = new AWS.DynamoDB.DocumentClient({
apiVersion: '2018-10-01'
});

exports.handler = (event, context, callback) => {
    //TODO: Change to pull all messages off queue every 10 seconds or minute.
    console.log("event...");
    console.log(event);
    console.log("record 0...");
    console.log(event.Records[0]);
    getAllAnimals()
    .then((allAnimals) => {
        console.log("All animals");
        console.log(allAnimals);
        for (let ballot of event.Records) {
        console.log("A record...");
        console.log(ballot);
        var winnerID = parseInt(ballot.messageAttributes.Winner.stringValue)
        var loserID = parseInt(ballot.messageAttributes.Loser.stringValue);
        allAnimals = addWinTo(winnerID, allAnimals);
        allAnimals = addLossTo(loserID, allAnimals);
        }
        return allAnimals;
    })
    .then(putAllAnimals);
};

function addWinTo(animalID, allAnimals) {
    allAnimals.Item.Animals[animalID].Wins = allAnimals.Item.Animals[animalID].Wins + 1;
    return allAnimals;

}

function addLossTo(animalID, allAnimals) {
   allAnimals.Item.Animals[animalID].Losses = allAnimals.Item.Animals[animalID].Losses + 1;
   return allAnimals;
}

function getAllAnimals() {
  var get_params = {
  Key: {
   "ID": "0",
  },
  TableName: "AllAnimals"
 };

 var request = io.get(get_params);
 var promise = request.promise();
 return promise;
}

function putAllAnimals(allAnimals){
 var put_params = {
  Item: allAnimals.Item,
  TableName: 'AllAnimals'
 };
 var request = io.put(put_params);
 var promise = request.promise();
 return promise;
}
