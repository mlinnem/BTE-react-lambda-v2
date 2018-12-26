import React from 'react';
import {hideRules} from "./actionsAndReducers";
import CloseButton from "./CloseButton";
const ReactRedux = require('react-redux');

const rulesModal_mapStateToProps = (state, ownProps) => {return {
  visibilityState: state.ui.rulesVisibilityState,
}};

const rulesModal_mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCloseModalClick: () => {
        dispatch(hideRules());
      }
    }
  };



class RulesModal_View extends React.Component {
render () {
  return (
    <div className={"rulesModalContainer " + this.props.visibilityState}>
    <div className="modalBackground" onClick={this.props.onCloseModalClick}>
      <div className="rulesModalFrame">
      <div className="rulesModalHeader">
        <span className="rulesModalTitle">Rules</span>
        <CloseButton onClick={this.props.onCloseModalClick}/>
      </div>
      <div className="rulesModalBody">
      <ol>
      <li>Both animals are totally enraged. They will stop at nothing to defeat their foe.</li>
      <li>The first animal to die loses.</li>
      <li>Animals fight using only their natural instincts.</li>
      <li>Animals fight in an arena made up of one half of each animal's native habitat.</li>
      <li>Animals begin the fight in their half of the arena, within eyesight of their foe.</li>
      </ol>
      </div>
      </div>
    </div>
    </div>
)
  }
}
const RulesModal = ReactRedux.connect(
  rulesModal_mapStateToProps,
  rulesModal_mapDispatchToProps
)(RulesModal_View);




export default RulesModal;
