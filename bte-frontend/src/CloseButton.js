
import React from 'react';
const ReactRedux = require('react-redux');

class CloseButton_View extends React.Component {
render () {
  return (
    <svg className="closeButton" width="48px" height="48px" viewBox="0 0 48 48" version="1.1" onClick={this.props.onClick}  >
        <title>closeIcon</title>
        <g id="closeIcon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Group-15">
                <circle id="Oval" fill="#FDDCB0" cx="24" cy="24" r="24"></circle>
                <path d="M16.3809524,16.3809524 L32,32" id="Line" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="square"></path>
                <path d="M16.3809524,16.3809524 L32,32" id="Line" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="square" transform="translate(24.000000, 24.000000) scale(-1, 1) translate(-24.000000, -24.000000) "></path>
            </g>
        </g>
    </svg>
);
  }
}
const CloseButton = ReactRedux.connect(
)(CloseButton_View);

export default CloseButton;
