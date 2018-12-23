

import React from 'react';
import './index.scss';
import RankingsPanel from "./RankingsPanel";
import ResultsPanel from "./ResultsPanel"
const ReactRedux = require('react-redux');

const ballotBox_mapStateToProps = (state) => { return {
  ballotStore: state.ballots.ballotStore,
  shouldBeJumping: state.ui.ballotBoxShouldBeJumping,
}};

class BallotBox_View extends React.Component {
  render() {
    var jump = "";
    if (this.props.shouldBeJumping) {
      jump = "jump";
    }
      return <div className={"animatedballotbox ballotBox " + jump} ><ResultsPanel/><RankingsPanel/></div>;
    }
}

const BallotBox= ReactRedux.connect(
ballotBox_mapStateToProps,
)(BallotBox_View);

export default BallotBox;
