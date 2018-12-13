
import React from 'react';
import './index.css';
import * as ar from "./actionsAndReducers";
import AnimalListing from "./AnimalListing"
const ReactRedux = require('react-redux');


const rankingsPanel_mapStateToProps = (state, ownProps) => {return {
animalStore : state.animals.animalStore,
rankOrder: state.animals.rankOrder
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
    var animalListings = [];
    for (var i = 0; i < this.props.rankOrder.length; i++) {
      var animalListing = <AnimalListing id={this.props.rankOrder[i]} rank={i + 1}/>
      animalListings.push(animalListing);
    }
    return <div className={"rankingsPanel"}><button onClick={this.props.onReturnToVotingClick}>Return To Voting</button>{animalListings}</div>;
  }
}

const RankingsPanel = ReactRedux.connect(
rankingsPanel_mapStateToProps,
rankingsPanel_mapDispatchToProps
)(RankingsPanel_View);


export default RankingsPanel;
