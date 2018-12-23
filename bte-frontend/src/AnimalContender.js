import React from 'react';
import posed from 'react-pose';
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
  return (
<span className={"outerCardWrapper " + this.props.side}>
  <span className={"cardWrapper " + this.props.side}>
    <div className={this.props.animationState + " animal"} pose={this.props.animationState} onClick={this.props.onBallotClick}>
    <img className="photo" src={"https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/photos?animalName=" + encodeURIComponent(this.props.animal.Name) + "&size=Width_1200"}/>
      <div className ="animalNameBox">
        <span className="animalName">{this.props.animal.Name}</span>
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
