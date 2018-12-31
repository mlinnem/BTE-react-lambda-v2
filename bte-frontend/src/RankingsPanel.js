
import React from 'react';
import './index.scss';
import * as ar from "./actionsAndReducers";
import AnimalListing from "./AnimalListing";
import ReactDOM from 'react-dom';
const ReactRedux = require('react-redux');

const rankingsPanel_mapStateToProps = (state, ownProps) => {return {
animalStore : state.animals.animalStore,
rankOrder: state.animals.rankOrder,
focusArea : state.ui.focusArea

}};
class RankingsPanel_View extends React.Component {
render() {


  if (this.props.focusArea === ar.FOCUSAREA.RANKINGS) {
    const node = ReactDOM.findDOMNode(this);
    node.scrollTop = 0;
  }

    var animalListings = [];
    for (var i = 0; i < this.props.rankOrder.length; i++) {
      var animalListing = <AnimalListing key={i} id={this.props.rankOrder[i]} rank={i + 1}/>
      animalListings.push(animalListing);
    }
    return (
    <div className={"rankingsPanel"}>
      <div className="rankingsHeader">
        <span className="rankingsHeaderTitle">Rankings</span>
      </div>
      <div className="rankingsContent">
      {animalListings}
      </div>
    </div>
  )
  }
}

const RankingsPanel = ReactRedux.connect(
rankingsPanel_mapStateToProps,
)(RankingsPanel_View);


export default RankingsPanel;
