import React from 'react';
import Ballot from "./Ballot";
const ReactRedux = require('react-redux');

const ballotViewer_mapStateToProps = (state) => { return {
fake : console.log("ballotViewer_mapStateToProps running"),
  ballotStore: state.ballots.ballotStore,
}};
class BallotViewer_View extends React.Component {
render() {
  console.log("rendering ballotviewer");
  console.log("this.props.ballotStore:");
  console.log(this.props.ballotStore);
  if (Object.keys(this.props.ballotStore).length === 0) {
    console.log("...ballots still loading...");
    return <div className="ballotViewer">Loading...</div>
  } else {
    console.log("Why do I think there's ballots here?");
    var ballots = Object.keys(this.props.ballotStore).map((ballotID) => {
      var ballot = this.props.ballotStore[ballotID];
      return <Ballot key={ballot.ID} id={ballot.ID} animal1ID={ballot.Animal1ID} animal2ID={ballot.Animal2ID} queueState={ballot.QueueState}/>
    });
    return <div className="ballotViewer">{ballots}</div>;
  }
}
}
const BallotViewer = ReactRedux.connect(
ballotViewer_mapStateToProps,
)(BallotViewer_View);

export default BallotViewer;
