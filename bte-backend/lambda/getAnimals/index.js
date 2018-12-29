const Constants = require( "./c_constants");

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var io = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-10-01'});

 exports.handler =  (event) => {
   return getAnimals();
};

async function getAnimals() {
  console.log("CONSTANT: " + Constants.SESSION_IDENTIFIER);
    var getAnimalsPromise = backend_getAnimals();
    var getRankingsPromise = backend_getRankings();

    console.log("Get Animals and Animal Rankings");
    var animals, rankings;
    [animals, rankings] = await Promise.all([getAnimalsPromise,getRankingsPromise]);

    console.log("Produce response based on results");
    return generateResponse(animals, rankings);
}

function generateResponse(animals, rankings) {
  const response = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "*",
    "Access-Control-Allow-Headers" : "*"},
  body: {
    "AnimalStore" : JSON.stringify(animals),
    "AnimalIDsInRankOrder" : JSON.stringify(rankings)
  }
};
console.log(response);
return response;
}


//--BACKEND--

function backend_getAnimals() {
  var scan_params = { //TODO: Handle case where payload is > 1 MB (pagination?)
    TableName : 'Animals',
  };

  console.log("...get_animals_params:");
  console.log(scan_params);

  var promise = io.scan(scan_params).promise().then((result) => {
    console.log("...get_animals result:");
    console.log(result);

    var animalsArray = result.Items;

    var animalsByID = {};
    for (let animalIndex in animalsArray) {
      var animal = animalsArray[animalIndex];
      animalsByID[animal.ID] = animal;
    }

    return animalsByID;
  }).catch((error) => {
    console.error(error);
    return error;
  });

  return promise;
}

function backend_getRankings() {
  var get_params = {
  "Key": {
   "Statistic": "Rankings",
  },
  TableName: "SummaryStatistics"
 };

 return io.get(get_params).promise().then((result) => {
    console.log("get rankings result:");
   console.log(result);
   return result.Item.Value;
 }).catch((error) => {
   return error;
 });
}
