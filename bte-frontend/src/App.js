

import React from 'react';
import './index.css';

import Header from './Header';
import Contents from "./Contents";
import BallotBox from "./BallotBox"
import BallotViewer from "./BallotViewer"

class App extends React.Component {
render() {
    return <div className="app"><Header/><BallotViewer/><BallotBox/></div>;
}
}

export default App;
