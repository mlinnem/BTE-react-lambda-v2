import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Link, Prompt, Switch, Redirect } from "react-router-dom";
import AnimalListing from "./AnimalListing"
import Header from "./Header"
import AnimalContender from "./AnimalContender"

import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');
const Redux = require('redux');

function startup() {
ar.store.dispatch(ar.fetchAuthKeyIfNeeded());
}



//--Components--


class App extends React.Component {
render() {
    return <div><Header></Header><Contents></Contents></div>;
}
}



class Contents extends React.Component {
render () {
  return (
  <Router>
  <div>
    <SubHeader></SubHeader>
      <BallotViewer></BallotViewer>
      <img src="/Burst.png" className="burst"></img>
      <div className="ballotBox"></div>
  </div>
  </Router>
  );
}
}

class SubHeader extends React.Component {
render () {
  return (
    <ul>
    </ul>
  );
}
}

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

const ballotViewer_mapStateToProps = (state) => { return {
fake : console.log("ballotViewer_mapStateToProps running"),
  ballotStore: state.ballots.ballotStore,
}};
class BallotViewer_View extends React.Component {
render() {
  console.log("rendering ballotviewer");
  console.log("this.props.ballotStore:");
  console.log(this.props.ballotStore);
  if (Object.keys(this.props.ballotStore).length == 0) {
    console.log("...ballots still loading...");
    return <div className="ballotViewer">Loading...</div>
  } else {
    console.log("Why do I think there's ballots here?");
    var ballots = Object.keys(this.props.ballotStore).map((ballotID) => {
      var ballot = this.props.ballotStore[ballotID];
      return <Ballot key={ballot.ID} id={ballot.ID} animal1ID={ballot.Animal1ID} animal2ID={ballot.Animal2ID} queueState={ballot.QueueState}/>
    });
    return <div className="ballotViewer">{ballots}</div>;
  }
}
}
const BallotViewer = ReactRedux.connect(
ballotViewer_mapStateToProps,
)(BallotViewer_View);

const ballot_mapStateToProps= (state, ownProps) => { return {
fake: console.log("ballot_mapStateToProps"),
ballot: state.ballots.ballotStore[ownProps.id],
}};
class Ballot_View extends React.Component {
render () {
  console.log("re-rendering ballot");

  if (this.props.ballot == null) {
    console.log("WEIRD NULL BALLOT");
    return null;
  }
  console.log(this.props.ballot.QueueState);
  return (
  <div>
    <AnimalContender id={this.props.ballot.Animal1ID} animationState={this.props.ballot.QueueState + "left"} side={SIDE.LEFT}/>
    <AnimalContender id={this.props.ballot.Animal2ID} animationState={this.props.ballot.QueueState + "right"} side={SIDE.RIGHT}/>
  </div>
  );
}
}
const Ballot = ReactRedux.connect(
ballot_mapStateToProps
)(Ballot_View);







const SIDE = {
LEFT: "LEFT",
RIGHT : "RIGHT"
}

ReactDOM.render(
<ReactRedux.Provider store={ar.store}>
  <App/>
</ReactRedux.Provider>, document.getElementById('root')
);

startup();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
