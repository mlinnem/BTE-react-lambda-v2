

import React from 'react';
import './index.css';

import Header from './Header';
import Contents from "./Contents";

class App extends React.Component {
render() {
    return <div className="app"><Header/><Contents/></div>;
}
}

export default App;
