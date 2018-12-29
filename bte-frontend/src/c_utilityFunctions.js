exports.constructMatchupID = function constructMatchupID (winner, loser) {
  if (winner <= loser) {
    return winner.toString() + "_" + loser.toString();
  } else {
      return loser.toString() + "_" + winner.toString();
  }
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
