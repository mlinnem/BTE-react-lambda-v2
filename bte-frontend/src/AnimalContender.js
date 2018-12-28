import React from 'react';
import {submitBallotAndAdvance} from "./actionsAndReducers"
const ReactRedux = require('react-redux');


const animalContender_mapStateToProps = (state, ownProps) => {return {
animal : state.animals.animalStore[ownProps.id]
}};
const animalContender_mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onBallotClick: () => {
        dispatch(submitBallotAndAdvance(ownProps.side));
      }
    }
  };


class AnimalContender_View extends React.Component {
render () {
  var votedFor = "";
  if (this.props.votedFor) {
    votedFor = "votedFor";
  }

  if (!this.props.animal) {
    return "Failure to load animal with ID: " + this.props.id; //TODO: Have a general error display mechanism
  }

  return (
<span className={"outerCardWrapper " + this.props.side}>
  <span className={"cardWrapper " + this.props.side + " " + votedFor}>
    <div className={this.props.animationState + " animal " + votedFor} onClick={this.props.onBallotClick}>
      <div className={"cardAndHover" }>
      <div className="theCard">
        <img className="photo" alt={this.props.animal.Name} src={"https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/photos?animalName=" + encodeURIComponent(this.props.animal.Name) + "&size=Width_600"}/>
        <div className ="animalNameBox">
          <span className="animalName">{this.props.animal.Name}</span>
        </div>
      </div>
      <div className={"cardHover " + votedFor}/>
      </div>
    </div>
  </span>
</span>
)
  }
}
const AnimalContender = ReactRedux.connect(
animalContender_mapStateToProps,
animalContender_mapDispatchToProps
)(AnimalContender_View);




export default AnimalContender;
