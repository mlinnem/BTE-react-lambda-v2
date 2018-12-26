import React from 'react';
import Ballot from "./Ballot";
import LoadingIndicator from "./LoadingIndicator"
const ReactRedux = require('react-redux');

const ballotViewer_mapStateToProps = (state) => { return {
  ballotStore: state.ballots.ballotStore,
}};
class BallotViewer_View extends React.Component {
render() {
  if (Object.keys(this.props.ballotStore).length === 0) {
    return <div className="ballotViewer"><LoadingIndicator/></div>
  } else {
    var ballots = Object.keys(this.props.ballotStore).map((ballotID) => {
      var ballot = this.props.ballotStore[ballotID];
      return <Ballot key={ballot.ID} id={ballot.ID} animal1ID={ballot.Animal1ID} animal2ID={ballot.Animal2ID} queueState={ballot.QueueState}/>
    });

    return (
      <div className="ballotViewer">
        {ballots}
      </div>
    );
  }
}
}
const BallotViewer = ReactRedux.connect(
ballotViewer_mapStateToProps,
)(BallotViewer_View);

export default BallotViewer;
