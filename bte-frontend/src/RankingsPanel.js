
import React from 'react';
import './index.css';
import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');

const rankingsPanel_mapStateToProps = (state, ownProps) => {return {
animalStore : state.animals.animalStore,
rankOrder: state.animals.rankOrder,
}};
const rankingsPanel_mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onReturnToVotingClick: () => {
        dispatch(ar.hideRankings());
      }
    }
  };
class RankingsPanel_View extends React.Component {
render() {
    return <div className={"rankingsPanel"}><button onClick={this.props.onReturnToVotingClick}>Return To Voting</button></div>;
  }
}

const RankingsPanel = ReactRedux.connect(
rankingsPanel_mapStateToProps,
rankingsPanel_mapDispatchToProps
)(RankingsPanel_View);


export default RankingsPanel;
