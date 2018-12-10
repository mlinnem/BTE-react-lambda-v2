

import React from 'react';
import './index.css';
import RankingsPanel from "./RankingsPanel";


class BallotBox extends React.Component {
  render() {
      return <div className={"animatedballotbox ballotBox "} ><RankingsPanel/></div>;
    }
}



export default BallotBox;
