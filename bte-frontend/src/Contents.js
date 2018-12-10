import React from 'react';
import BallotViewer from "./BallotViewer"
import BallotBox from "./BallotBox"
import posed from 'react-pose';

const ReactRedux = require('react-redux');

const AnimatedContents = posed.div({
  show_ballots : {y: '0px'},
  show_rankings: {y: '-100vh' , transition: {y : {ease: 'anticipate', duration: 550}}},
});

const contents_mapStateToProps = (state, ownProps) => {return {

  focusArea : state.ui.focusArea
}};

class Contents_View extends React.Component {
  render() {
    return (
    <AnimatedContents className={"contents animatedcontents " + this.props.focusArea }>
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
