import React from 'react';
import './index.css';
import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');

class LoadingIndicator extends React.Component {
render() {
    return <img className={"loadingIndicator"} src="./brush.png"></img>;
  }
}

export default LoadingIndicator;
