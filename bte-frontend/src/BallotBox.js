

import React from 'react';
import './index.scss';
import RankingsPanel from "./RankingsPanel";
import ResultsPanel from "./ResultsPanel"
import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');

const ballotBox_mapStateToProps = (state) => { return {
  ballotStore: state.ballots.ballotStore,
  shouldBeJumping: state.ui.ballotBoxShouldBeJumping,
}};

  const ballotBox_mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onReturnToVotingClick: () => {
          dispatch(ar.hideRankings());
        },
        onViewRankingsClick: () => {
            dispatch(ar.showRankings());
          }
      }
    };



class BallotBox_View extends React.Component {
  render() {
    var jump = "";
    if (this.props.shouldBeJumping) {
      jump = "jump";
    }
      return (
        <div className={"animatedballotbox ballotBox " + jump} >
          <ResultsPanel/>
          <div className={"spacer"}>
              <button className={"viewRankings"} onClick={this.props.onViewRankingsClick}>View Rankings</button>
            </div>
          <button className={"viewBallots " + jump} onClick={this.props.onReturnToVotingClick}>Return To Voting</button>
          <RankingsPanel/>
        </div>
      );
    }
}

const BallotBox= ReactRedux.connect(
ballotBox_mapStateToProps,
ballotBox_mapDispatchToProps
)(BallotBox_View);

export default BallotBox;
