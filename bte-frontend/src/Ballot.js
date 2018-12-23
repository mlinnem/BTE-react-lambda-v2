import React from 'react';
import AnimalContender from "./AnimalContender"
const ReactRedux = require('react-redux');

const ballot_mapStateToProps= (state, ownProps) => { return {
ballot: state.ballots.ballotStore[ownProps.id],
}};


class Ballot_View extends React.Component {
render () {
  console.log("re-rendering ballot");

  if (this.props.ballot == null) {
    console.log("WEIRD NULL BALLOT");
    return null;
  }
  console.log(this.props.ballot.QueueState);

  var leftVotedFor = "";
  var rightVotedFor = "";
  if (this.props.ballot.WinnerSide === "LEFT") {
    leftVotedFor = true;
  } else if (this.props.ballot.WinnerSide === "RIGHT") {
    rightVotedFor = true;
  }
  
  return (
  <div className={"ballot " + this.props.ballot.QueueState + "ballot"}>
    <AnimalContender id={this.props.ballot.Animal1ID} animationState={this.props.ballot.QueueState + "left"} side={SIDE.LEFT} votedFor={leftVotedFor}/>
    <AnimalContender id={this.props.ballot.Animal2ID} animationState={this.props.ballot.QueueState + "right"} side={SIDE.RIGHT} votedFor={rightVotedFor}/>
    <div className={"ballotBackground " + this.props.ballot.QueueState }></div>
  </div>
  );
}
}
const Ballot = ReactRedux.connect(
ballot_mapStateToProps
)(Ballot_View);

const SIDE = {
LEFT: "LEFT",
RIGHT : "RIGHT"
}

export default Ballot;
