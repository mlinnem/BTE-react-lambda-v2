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
oldOutgoingBallotID: state.ballots.oldOutgoingBallotID,
stepInProcess: state.ui.resultsPanelStepInProcess,
}};

class ResultsPanel_View extends React.Component {
render() {

    var ballotToShowID;
    if (this.props.stepInProcess === "rewrite") {
      u.t("Resultspanel, rewrite:");
      ballotToShowID = this.props.oldOutgoingBallotID;
    } else if (this.props.stepInProcess === "show") {
      u.t("Resultspanel, show:");
      ballotToShowID = this.props.outgoingBallotID;
    } else {
      u.t("Should be either rewrite or show in resultspanel");
    }

    if (ballotToShowID) {
      var ballotToShow = this.props.ballotStore[ballotToShowID];
      var animal1 = this.props.animalStore[ballotToShow.Animal1ID];
      var animal2 = this.props.animalStore[ballotToShow.Animal2ID];
      u.t("animal1:", 1);
      u.t_o(animal1);
      u.t("animal2:", 1);
      u.t_o(animal2);

      var animal1Wins = ballotToShow.MatchupData.Animal1Wins;
      var animal2Wins = ballotToShow.MatchupData.Animal2Wins;

      var total = animal1Wins + animal2Wins;

      if (total == 0) {
        //TODO: This is a hack. Handle this case properly.
        total = 2;
        animal1Wins = 1;
        animal2Wins = 1;
      }

      var animal1WinsAfter = animal1Wins;
      var animal2WinsAfter = animal2Wins;
      var totalAfter = total;

      totalAfter += 1;

      if (ballotToShow.WinnerSide === "LEFT") {
        animal1WinsAfter += 1;

        return (
          <div className={"resultsPanel " +  this.props.stepInProcess}>
            <PercentWinsRow animalID={ballotToShow.Animal1ID} didWin={true} winPercentageBefore={animal1Wins / total} winPercentageAfter={animal1WinsAfter / totalAfter}/>
            <PercentWinsRow animalID={ballotToShow.Animal2ID} didWin={false} winPercentageBefore={animal2Wins / total} winPercentageAfter={animal2WinsAfter / totalAfter}/>

          </div>
        )
      } else if (ballotToShow.WinnerSide === "RIGHT") {
        animal2WinsAfter += 1;
        return (
          <div className={"resultsPanel " +  this.props.stepInProcess}>
            <PercentWinsRow animalID={ballotToShow.Animal2ID} didWin={true} winPercentageBefore={animal2Wins / total} winPercentageAfter={animal1WinsAfter / totalAfter}/>
            <PercentWinsRow animalID={ballotToShow.Animal1ID} didWin={false} winPercentageBefore={animal1Wins / total} winPercentageAfter={animal2WinsAfter / totalAfter}/>
          </div>
      );
      } else {
        return "Error";
      }
    } else {
      return <div className={"resultsPanel " + this.props.stepInProcess}></div>;
    }

  }
}

const ResultsPanel = ReactRedux.connect(
resultsPanel_mapStateToProps,
)(ResultsPanel_View);


export default ResultsPanel;
