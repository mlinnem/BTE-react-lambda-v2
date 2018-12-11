

import React from 'react';
import './index.css';
import RankingsPanel from "./RankingsPanel";
import ResultsPanel from "./ResultsPanel"


class BallotBox extends React.Component {
  render() {
      return <div className={"animatedballotbox ballotBox "} ><ResultsPanel/><RankingsPanel/></div>;
    }
}



export default BallotBox;
