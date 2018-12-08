import React from 'react';
import posed from 'react-pose';
import AnimalListing from "./AnimalListing"
const ReactRedux = require('react-redux');

const rankedAnimals_mapStateToProps = (state) => {
return {
  animals: state.animals
}
};
class RankedAnimals_View extends React.Component {
render () {
  const animals = this.props.animals.animalStore;
  const rankOrder = this.props.animals.rankOrder;
  if (animals != null) {
    var animalsHTML = [];
    for (var i = 0; i < rankOrder.length; i++) {
      var animalKey = rankOrder[i];
      animalsHTML.push(<AnimalListing key={i} name={animals[animalKey].Name} rank={i+1} id={animalKey}></AnimalListing>);
    }
    return <div> {animalsHTML}
          </div>;
    } else {
return <div>Loading...</div>
  }
}
}
const RankedAnimals = ReactRedux.connect(rankedAnimals_mapStateToProps)(RankedAnimals_View);

export default RankedAnimals;
