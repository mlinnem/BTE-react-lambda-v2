

import React from 'react';
import './index.css';

import Header from './Header';
import Contents from "./Contents";


class App extends React.Component {
render() {
    return <div><Header></Header><Contents></Contents></div>;
}
}

export default App;
