import React from 'react';
import './index.scss';
import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');

const resultsPanel_mapStateToProps = (state, ownProps) => {return {
animalStore : state.animals.animalStore,
rankOrder: state.animals.rankOrder,
}};

class ResultsPanel_View extends React.Component {
render() {
    return <div className={"resultsPanel"}></div>;
  }
}

const ResultsPanel = ReactRedux.connect(
resultsPanel_mapStateToProps,
)(ResultsPanel_View);


export default ResultsPanel;
