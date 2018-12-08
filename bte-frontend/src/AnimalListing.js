import React from 'react';
const ReactRedux = require('react-redux');

const animalListing_mapStateToProps = (state, ownProps) => { return {
  name: state.animals.animalStore[ownProps.id].Name,
  rank: ownProps.id
}};

class AnimalListing_View extends React.Component {
render () {
  return <div>{this.props.rank} - {this.props.name}</div>;
  }
}

const AnimalListing = ReactRedux.connect(
animalListing_mapStateToProps)(AnimalListing_View);

export default AnimalListing;
