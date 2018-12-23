import React from 'react';
import './index.scss';
import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');

const resultsPanel_mapStateToProps = (state, ownProps) => {return {
animalStore : state.animals.animalStore,
rankOrder: state.animals.rankOrder,
}};
const resultsPanel_mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onViewRankingsClick: () => {
        dispatch(ar.showRankings());
      }
    }
  };
class ResultsPanel_View extends React.Component {
render() {
    return <div className={"resultsPanel"}><button onClick={this.props.onViewRankingsClick}>View Rankings</button></div>;
  }
}

const ResultsPanel = ReactRedux.connect(
resultsPanel_mapStateToProps,
resultsPanel_mapDispatchToProps
)(ResultsPanel_View);


export default ResultsPanel;
