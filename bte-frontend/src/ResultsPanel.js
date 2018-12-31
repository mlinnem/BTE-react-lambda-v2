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
      ballotToShowID = this.props.oldOutgoingBallotID;
    } else if (this.props.stepInProcess === "show") {
      ballotToShowID = this.props.outgoingBallotID;
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

      if (ballotToShow.WinnerSide === "LEFT") {
        return (
          <div className={"resultsPanel " + this.props.stepInProcess}>
            <PercentWinsRow animalID={ballotToShow.Animal1ID} didWin={true} winPercentage={animal1Wins / total}/>
            <PercentWinsRow animalID={ballotToShow.Animal2ID} didWin={false} winPercentage={animal2Wins / total}/>

          </div>
        )
      } else if (ballotToShow.WinnerSide === "RIGHT") {
        return (
          <div className={"resultsPanel"}>
            <PercentWinsRow animalID={ballotToShow.Animal2ID} didWin={true} winPercentage={animal2Wins / total}/>
            <PercentWinsRow animalID={ballotToShow.Animal1ID} didWin={false} winPercentage={animal1Wins / total}/>
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
