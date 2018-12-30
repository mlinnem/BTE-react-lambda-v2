import React from 'react';
import './index.scss';
// import * as ar from "./actionsAndReducers";
const u = require("./c_utilityFunctions");
const ReactRedux = require('react-redux');

const percentWinsRow_mapStateToProps = (state, ownProps) => {return {
  animalStore: state.animals.animalStore,
  animalID: ownProps.animalID,
  didWin: ownProps.didWin,
  winPercentage: ownProps.winPercentage,
}};

class PercentWinsRow_View extends React.Component {
render() {
  var animal = this.props.animalStore[this.props.animalID];
  return (
    <div className="winRateRow">
    <img alt={animal.Name} src={"https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/photos?animalName=" + encodeURIComponent(animal.Name) + "&size=Width_100"}/>
    <div className="percentBarBlock">
      <div className="percentBar">
        {animal.Name}
      </div>
        <div className="percentAsNumbers">with {(this.props.winPercentage * 100).toFixed(0) + "%"}</div>
    </div>

  </div>
);
  }
}

const PercentWinsRow = ReactRedux.connect(
percentWinsRow_mapStateToProps,
)(PercentWinsRow_View);


export default PercentWinsRow;
