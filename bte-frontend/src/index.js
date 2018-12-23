import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
//import App from './App';
import * as serviceWorker from './serviceWorker';
import App from "./App"

import * as ar from "./actionsAndReducers";
const ReactRedux = require('react-redux');


ReactDOM.render(
<ReactRedux.Provider store={ar.store}>
  <App/>
</ReactRedux.Provider>, document.getElementById('root')
);

startup();

function startup() {
ar.store.dispatch(ar.fetchAuthKeyIfNeeded());
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
