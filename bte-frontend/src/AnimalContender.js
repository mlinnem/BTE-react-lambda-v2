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
  return <span className={"outerCardWrapper " + this.props.side}><span className={"cardWrapper " + this.props.side}><Box className={this.props.animationState + " animal box"} pose={this.props.animationState} onClick={this.props.onBallotClick}><span className="animalName">{this.props.animal.Name}</span></Box ></span></span>
  }
}
const AnimalContender = ReactRedux.connect(
animalContender_mapStateToProps,
animalContender_mapDispatchToProps
)(AnimalContender_View);


const Box = posed.div({
  hiddenleft: { x: '-100vw' , transition: {x : {ease: 'easeOut', duration: 1350}}},
  incomingleft: { x: '0vw' , transition: {x : {ease: 'easeOut', duration: 1350}}},
  outgoingleft: {y: '100vh', transition: {y : {ease: 'easeOut', duration: 550}}},
  hiddenright: { x: '100vw', transition: {x : {ease: 'easeOut', duration: 1350}}},
  incomingright: { x: '0vw', transition: {x : {ease: 'easeOut', duration: 1350}}},
  outgoingright: {x: '0vw', y:'100vh',  transition: {y : {ease: 'easeOut', duration: 550}}}
});

export default AnimalContender;
