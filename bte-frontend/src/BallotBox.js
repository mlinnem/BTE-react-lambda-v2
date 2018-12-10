

import React from 'react';
import './index.css';
import * as ar from "./actionsAndReducers";
import RankingsPanel from "./RankingsPanel";
import posed from 'react-pose';

const ReactRedux = require('react-redux');


class BallotBox extends React.Component {
  render() {
      return <div className={"animatedballotbox ballotBox "} ><RankingsPanel/></div>;
    }
}



export default BallotBox;
