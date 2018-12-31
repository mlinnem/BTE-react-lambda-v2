import React from 'react';
import './index.scss';
import PercentWinsRow from "./PercentWinsRow";
// import * as ar from "./actionsAndReducers";
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
      var animal2Wins = outgoingBallot.MatchupData.Animal2Wins;

      var total = animal1Wins + animal2Wins;

      if (outgoingBallot.WinnerSide === "LEFT") {
        return (
          <div className={"resultsPanel"}>
            <PercentWinsRow animalID={outgoingBallot.Animal1ID} didWin={true} winPercentage={animal1Wins / total}/>
            <PercentWinsRow animalID={outgoingBallot.Animal2ID} didWin={false} winPercentage={animal2Wins / total}/>

          </div>
        )
      } else if (outgoingBallot.WinnerSide === "RIGHT") {
        return (
          <div className={"resultsPanel"}>
            <PercentWinsRow animalID={outgoingBallot.Animal2ID} didWin={true} winPercentage={animal2Wins / total}/>
            <PercentWinsRow animalID={outgoingBallot.Animal1ID} didWin={false} winPercentage={animal1Wins / total}/>
          </div>
      );
      } else {
        return "Error";
      }
    } else {
      return <div className={"resultsPanel"}></div>;
    }

  }
}

const ResultsPanel = ReactRedux.connect(
resultsPanel_mapStateToProps,
)(ResultsPanel_View);


export default ResultsPanel;
