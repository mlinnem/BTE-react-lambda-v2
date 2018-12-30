exports.constructMatchupID = function constructMatchupID (winner, loser) {
  if (winner <= loser) {
    return winner.toString() + "_" + loser.toString();
  } else {
      return loser.toString() + "_" + winner.toString();
  }
}

//Should follow format "N_N";
exports.extractAnimal1ID_from_matchupID = function extractAnimal1ID_from_matchupID (matchupID) {
  var firstCharString = matchupID.substring(0, 1);
  var firstCharNumber = parseInt(firstCharString, 10);
  return firstCharNumber;
}

//Should follow format "N_N";
exports.extractAnimal2ID_from_matchupID = function extractAnimal2ID_from_matchupID (matchupID) {
  var lastCharString = matchupID.substring(matchupID.length - 1, matchupID.length);
  var lastCharNumber = parseInt(lastCharString, 10);
  return lastCharNumber;
}


exports.t = function t(message, indention = 0) {
  var spacing = "";
  for (let i = 0; i < indention; i++) {
    spacing = spacing + "    ";
  }
  console.log(spacing + message);
}

exports.t_o = function t_o(message) {
  //TODO: How to add indentation?
  console.log(message);
}
