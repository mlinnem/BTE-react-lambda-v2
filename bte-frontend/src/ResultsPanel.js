import React from 'react';
import './index.scss';
import * as ar from "./actionsAndReducers";
const u = require("./c_utilityFunctions");
const ReactRedux = require('react-redux');

const resultsPanel_mapStateToProps = (state, ownProps) => {return {
animalStore : state.animals.animalStore,
ballotStore: state.ballots.ballotStore,
outgoingBallotID: state.ballots.outgoingBallotID,
}};

class ResultsPanel_View extends React.Component {
render() {
    if (this.props.outgoingBallotID) {
      var outgoingBallot = this.props.ballotStore[this.props.outgoingBallotID];
      var animal1 = this.props.animalStore[outgoingBallot.Animal1ID];
      var animal2 = this.props.animalStore[outgoingBallot.Animal2ID];
      u.t("animal1:", 1);
      u.t_o(animal1);
      u.t("animal2:", 1);
      u.t_o(animal2);

      var animal1Wins = outgoingBallot.MatchupData.Animal1Wins;
      var animal2Wins = outgoingBallot.MatchupData.Animal1Wins; //TODO: Make sure these aren't flipped, on server
      return <div className={"resultsPanel"}>{animal1.Name} with {animal1Wins}, {animal2.Name} with {animal2Wins}</div>;
    } else {
      return <div className={"resultsPanel"}></div>;
    }

  }
}

const ResultsPanel = ReactRedux.connect(
resultsPanel_mapStateToProps,
)(ResultsPanel_View);


export default ResultsPanel;
