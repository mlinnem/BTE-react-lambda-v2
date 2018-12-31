import React from 'react';
import BallotViewer from "./BallotViewer"
import BallotBox from "./BallotBox"
// import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');

const contents_mapStateToProps = (state, ownProps) => {return {
  focusArea : state.ui.focusArea
}};


class Contents_View extends React.Component {
  render() {
    return (
    <div className={"contents animatedcontents " + this.props.focusArea }>
    <BallotViewer/>
    <div className="resultsPanelSpaceHolder"></div>
    <BallotBox focusArea={this.props.focusArea}/>
    </div>
    );
  }
}

const Contents = ReactRedux.connect(
contents_mapStateToProps,
)(Contents_View);

export default Contents;
