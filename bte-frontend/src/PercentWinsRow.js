import React from 'react';
import './index.scss';
// import * as ar from "./actionsAndReducers";
const u = require("./c_utilityFunctions");
const ReactRedux = require('react-redux');

const percentWinsRow_mapStateToProps = (state, ownProps) => {return {
  animalStore: state.animals.animalStore,
  animalID: ownProps.animalID,
  didWin: ownProps.didWin,
  winPercentageBefore: ownProps.winPercentageBefore,
  winPercentageAfter: ownProps.winPercentageAfter,
}};

class PercentWinsRow_View extends React.Component {
render() {
  var animal = this.props.animalStore[this.props.animalID];
  var percentWinString = (this.props.winPercentageBefore * 100).toFixed(0) + "%";
  var widthAsViewWidth = (this.props.winPercentageBefore * (90)).toFixed(0) + "vw"; //Leave room for margins and other bits.
  var agreeDisagree;

  if (this.props.didWin) {
    agreeDisagree = "agree";

  } else {
    agreeDisagree = "disagree";
  }




  //TODO: Width of bars is pretty hacky
   return (
    <div className="winRateRow">
      <div className={"resultsPanelPhotoContainer " + agreeDisagree} >
        <img alt={animal.Name}  src={"https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/photos?animalName=" + encodeURIComponent(animal.Name) + "&size=Width_100"}/>
        <img className={"checkAnnotation " + agreeDisagree}/>
      </div>
      <div className={"percentBarBlock "  + agreeDisagree}>
        <div className="percentBarAndAnimalName">
          <div className="percentBar" style={{width: "calc(" + widthAsViewWidth + " - 60px)", maxWidth: "calc(90vw - 180px)"}}></div>
          <div className="animalNameOnPercentBar">{animal.Name}</div>
        </div>
          <div className="percentAsNumbers">{percentWinString + " " + agreeDisagree}</div>
      </div>
    </div>
);
  }
}

const PercentWinsRow = ReactRedux.connect(
percentWinsRow_mapStateToProps,
)(PercentWinsRow_View);


export default PercentWinsRow;
