var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var io = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-10-01'});


exports.handler =  (event) => {
     calculateStats();
};

function calculateStats() {
  console.log("Calculate animal statistics...");
  calculateAnimalStatistics();
}

async function calculateAnimalStatistics() {
  console.log("Get animals");
  var animals = await backend_getAnimals();
  console.log(animals);

  console.log("Calculating rankings...");
  var animalIDAndWinPercentages = [];
  console.log("    For each animal...");
  for (let animalID in animals) {
    var animal = animals[animalID];
    console.log(animal);
    console.log("        Calculate win %");
    var winPercentage = animal.Wins / (animal.Wins + animal.Losses);
    console.log(winPercentage);
    var animalIDAndWinPercentage = {
      'ID' : animal.ID,
      'WinPercentage': winPercentage,
    };
    animalIDAndWinPercentages.push(animalIDAndWinPercentage);
  }


  console.log(animalIDAndWinPercentages);
  console.log("    Sort animals by win %");
  animalIDAndWinPercentages.sort((a,b) => {return b.WinPercentage - a.WinPercentage});
  console.log(animalIDAndWinPercentages);
  var animalIDsByWinPercentage = animalIDAndWinPercentages.map((animal) => {return animal.ID});
  console.log(animalIDsByWinPercentage);

  console.log("    Prepare database update");
  var putRankingsStatement = makePutRankingsStatement(animalIDsByWinPercentage);

  console.log(" Calculate animalCount");
  var animalCount = animals.length;

  console.log("    Prepare database update")
  var putAnimalCountStatement = makePutAnimalCountStatement(animalCount);

  console.log("Write all updates to backend");
  backend_writeAllUpdatesToBackend(putRankingsStatement, putAnimalCountStatement);
}

function makePutRankingsStatement(animalsSortedByWinPercentage) {
  var put_params =
  { "Item": {
    "Statistic" : "Rankings",
   "Value": animalsSortedByWinPercentage,
  },
  "TableName" : "SummaryStatistics"
 };

 console.log("...putRankings params:");
 console.log(put_params);
 return put_params;
}

function makePutAnimalCountStatement(animalCount) {
  var put_params =
  { "Item": {
    "Statistic" : "AnimalCount",
   "Value": animalCount,
  },
  "TableName" : "SummaryStatistics"
 };

 console.log("...putAnimalCount params:");
 console.log(put_params);
 return put_params;
}

//--BACKEND--

function backend_getAnimals() {
  var scan_params = { //TODO: Change to scan perhaps if performance is an issue?
    TableName : 'Animals',
  };

  console.log("...get_animals_params:");
  console.log(scan_params);

  var promise = io.scan(scan_params).promise().then((result) => {
    console.log("...get_animals result:");
    console.log(result);
    return result.Items;
  }).catch((error) => {
    console.error(error);
    return error;
  });

  return promise;
}

function backend_writeAllUpdatesToBackend(putRankingsStatement, putAnimalCountStatement) {
  var putRankingsPromise = io.put(putRankingsStatement).promise();
  var putAnimalCountStatement = io.put(putAnimalCountStatement).promise();
  return Promise.all([putRankingsPromise, putAnimalCountStatement])
  .then((results) => {
    console.log("...put_statistics results:");
    console.log(results);
    return results
  }).catch((error) => {
    console.error(error);
    return error;
  });
}
