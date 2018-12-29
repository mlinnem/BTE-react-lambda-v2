import React from 'react';

const Constants = require("./c_constants");

class Header extends React.Component {
render () {
  return <div className="header"><span className="header-text">{Constants.SESSION_IDENTIFIER}</span></div>;
  }
}

export default Header;
