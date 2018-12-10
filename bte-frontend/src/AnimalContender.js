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
    <AnimatedAnimalContender className={this.props.animationState + " animal box"} pose={this.props.animationState} onClick={this.props.onBallotClick}>
    <img className="photo" src="./rhino.png"/>
      <div className ="animalNameBox">
        <span className="animalName">{this.props.animal.Name}</span>
      </div>
    </AnimatedAnimalContender>
  </span>
</span>
)
  }
}
const AnimalContender = ReactRedux.connect(
animalContender_mapStateToProps,
animalContender_mapDispatchToProps
)(AnimalContender_View);


const AnimatedAnimalContender = posed.div({
  hiddenleft: { x: '-100vw' , transition: {x : {ease: 'easeOut', duration: 550}}},
  outgoingleft: {y: '100vh', transition: {y : {ease: 'easeOut', duration: 550}}},
  outgoingright: {x: '0vw', y:'100vh',  transition: {y : {ease: 'easeOut', duration: 550}}},
  incomingleft: { x: '0vw' , transition: {x : {ease: 'easeOut', duration: 1350}}},
  hiddenright: { x: '100vw', transition: {x : {ease: 'easeOut', duration: 550}}},
  incomingright: { x: '0vw', transition: {x : {ease: 'easeOut', duration: 1350}}},

});

export default AnimalContender;
