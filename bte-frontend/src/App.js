

import React from 'react';
import './index.scss';

import Header from './Header';
import Contents from "./Contents";
import RulesModal from "./RulesModal";

class App extends React.Component {
render() {
    return <div className="app"><Header/><Contents/><RulesModal/></div>;
}
}

export default App;
