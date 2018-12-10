import React from 'react';
import BallotViewer from "./BallotViewer"
import BallotBox from "./BallotBox"
import posed from 'react-pose';

const ReactRedux = require('react-redux');

const AnimatedContents = posed.div({
  ballots : {x: 0},
  rankings: {x: '-500px'}
});

const contents_mapStateToProps = (state, ownProps) => {return {
  fake: "contents mapStateToProps",
  focusArea : state.ui.focusArea
}};

class Contents_View extends React.Component {
  render() {
    return (
    <AnimatedContents className="contents animatedcontents" pose={this.props.focusArea}>
    <BallotViewer/>
    <BallotBox/>
    </AnimatedContents>
    );
    }
}
const Contents = ReactRedux.connect(
contents_mapStateToProps,
)(Contents_View);

export default Contents;
