import React from 'react';
const ReactRedux = require('react-redux');

const animalListing_mapStateToProps = (state, ownProps) => { return {
  animal: state.animals.animalStore[ownProps.id],
}};

class AnimalListing_View extends React.Component {
render () {
  return (
    <div className="animalListing">
      <div className="imageBlock">
        <img alt={this.props.animal.Name} src={"https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/photos?animalName=" + encodeURIComponent(this.props.animal.Name) + "&size=Width_100"}/>
      </div>
      <div className="descriptionBlock">
        <span className="description">
          <span className="rank">#{this.props.rank}</span>  <span className="name">{this.props.animal.Name}</span>
        </span>
      </div>
    </div>
)
  }
}

const AnimalListing = ReactRedux.connect(
animalListing_mapStateToProps)(AnimalListing_View);

export default AnimalListing;
