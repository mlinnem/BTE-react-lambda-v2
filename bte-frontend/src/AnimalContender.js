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
  return <Box className={this.props.animationState + " animal box"} pose={this.props.animationState} onClick={this.props.onBallotClick}><span className="animalName">{this.props.animal.Name}</span></Box >
}
}
const AnimalContender = ReactRedux.connect(
animalContender_mapStateToProps,
animalContender_mapDispatchToProps
)(AnimalContender_View);


const Box = posed.div({
  hiddenleft: { x: '-85vw' , transition: {x : {ease: 'easeOut', duration: 1350}}},
  incomingleft: { x: '5vw' , transition: {x : {ease: 'easeOut', duration: 1350}}},
  outgoingleft: {y: '105vh', transition: {y : {ease: 'easeOut', duration: 250}}},
  hiddenright: { x: '150vw', transition: {x : {ease: 'easeOut', duration: 1350}}},
  incomingright: { x: '60vw', transition: {x : {ease: 'easeOut', duration: 1350}}},
  outgoingright: {x: '60vw', y:'105vh',  transition: {y : {ease: 'easeOut', duration: 250}}}
});

export default AnimalContender;
