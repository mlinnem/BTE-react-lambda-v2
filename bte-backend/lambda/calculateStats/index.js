var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var io = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-10-01'});


exports.handler =  (event) => {
     calculateStats();
};

function calculateStats() {
  console.log("Calculate rankings...");
  calculateRankings();
}

async function calculateRankings() {
  console.log("    Get animals");
  var animals = await backend_getAnimals();

  var animalIDAndWinPercentages = [];
  console.log("    For each animal...");
  var animalIDs = Object.keys(animals);
  for (let animalID in animalIDs) {
    var animal = animalIDs[animalID];
    console.log("        Calculate win %");
    var winPercentage = animal.Wins / (animal.Wins + animal.Losses);
    var animalIDAndWinPercentage = {
      'ID' : animal.ID,
      'WinPercentage': winPercentage,
    };
    animalIDAndWinPercentages.push(animalIDAndWinPercentage);
  }

  //TODO: Double check order, highest first or lowest first?
  console.log("    Sort animals by win %");
  animalIDAndWinPercentages.sort((a,b) => {return a.WinPercentage - b.LossPercentage});
  var animalIDsByWinPercentage = animalIDAndWinPercentages.map((animal) => {return animal.ID});

  console.log("    Prepare database update");
  var putRankingsStatement = makePutRankingsStatement(animalIDsByWinPercentage);

  console.log("Write all updates to backend");
  backend_writeAllUpdatesToBackend(putRankingsStatement);
}

function makePutRankingsStatement(animalsSortedByWinPercentage) {
  var put_params =
  { "Item": {
    "Statistic" : "Rankings",
   "Rankings": animalsSortedByWinPercentage,
  },
  "TableName" : "SummaryStatistics"
 };

 console.log("...putRankings params:");
 console.log(put_params);
 return put_params;
}

//--BACKEND--

function backend_getAnimals() {
  var scan_params = {
    TableName : 'Animals',
  };

  console.log("...get_animals_params:");
  console.log(scan_params);

  var promise = io.scan(scan_params).promise().then((result) => {
    console.log("...get_animals result:");
    console.log(result);
    return result;
  }).catch((error) => {
    console.error(error);
    return error;
  });

  return promise;
}

function backend_writeAllUpdatesToBackend(putRankingsStatement) {
  var promise = io.put(putRankingsStatement).promise().then((result) => {
    console.log("...put_rankings_statement result:");
    console.log(result);
    return result.Items;
  }).catch((error) => {
    console.error(error);
    return error;
  });

  return promise;
}
