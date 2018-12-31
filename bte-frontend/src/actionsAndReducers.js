
import './index.scss';

const u = require("./c_utilityFunctions");

const Redux = require('redux');

const axios = require('axios');

//--Action creators (simple)--

export const advanceBallot = (winnerSide) => ({
type: "ADVANCE_BALLOT",
winnerSide: winnerSide,
});
export const attemptBallotSubmission = () => ({
type: "ATTEMPT_BALLOT_SUBMISSION"
});
export const confirmBallotSubmission = () => ({
type: "CONFIRM_BALLOT_SUBMISSION"
});
export const failBallotSubmission = () => ({
type: "FAIL_BALLOT_SUBMISSION"
});
export const requestMoreBallots = () => ({
type: 'REQUEST_MORE_BALLOTS',
});
export const receiveMoreBallots = (ballots) => ({
type: 'RECEIVE_MORE_BALLOTS',
ballots: ballots
});
export const failReceiveMoreBallots = () => ({
type: 'FAIL_RECEIVE_MORE_BALLOTS',
});
export const requestAuthKey= () => ({
type: "REQUEST_AUTH_KEY",
})
export const receiveAuthKey = (key) => ({
type: "RECEIVE_AUTH_KEY",
"key": key
})
export const failReceiveAuthKey = () => ({
type: "FAIL_RECEIVE_AUTH_KEY",
})
export const requestLatestAnimals= () => ({
type: "REQUEST_LATEST_ANIMALS",
})
export const receiveLatestAnimals = (animalStore, animalIDInRankOrder) => ({
type: "RECEIVE_LATEST_ANIMALS",
animalStore: animalStore,
animalIDsInRankOrder: animalIDInRankOrder
})
export const failReceiveLatestAnimals = () => ({
type: "FAIL_RECEIVE_LATEST_ANIMALS",
})
export const showRankings = () => ({
  type: "SHOW_RANKINGS",
})
export const hideRankings = () => ({
  type: "HIDE_RANKINGS",
})
export const clearBallotBoxJumping = () => ({
  type: "CLEAR_BALLOT_BOX_JUMPING",
});
export const changeResultsPanelToShow = () => ({
  type: "CHANGE_RESULTS_PANEL_TO_SHOW",
});

export const showRules = () => ({
  type: "SHOW_RULES",
});

export const hideRules = () => ({
  type: "HIDE_RULES",
});

//--Action creators (do real work)--

export const clearBallotBoxJumpingAfterDelay = (delayInMilliseconds) => {
  return async (dispatch, getState) => {
    console.log("WILL CLEAR BALLOT BOX JUMPING AFTER DELAY");
  await sleep(delayInMilliseconds);
    console.log("REALLY GOING TO CLEAR IT NOW");
  return dispatch(clearBallotBoxJumping());
}
}

export const changeResultsPanelToShowAfterDelay = (delayInMilliseconds) => {
  return async (dispatch, getState) => {
  await sleep(delayInMilliseconds);
  return dispatch(changeResultsPanelToShow());
}
}

export const submitBallotAndAdvance = (winnerSide) => {
return (dispatch, getState) => {
  dispatch(attemptBallotSubmission());
  //TODO: Needs tons more validation server side.
  var state = getState();
  var currentBallotID = state.ballots.ballotIDQueue[0];
  var authKey = state.authkey.key; //TODO: Need some logic if there is no key. Shouldn't happen but could maybe.
  console.log("The supposed ballot being submitted against...");
  var currentBallot = state.ballots.ballotStore[currentBallotID];
  console.log(currentBallot);
  dispatch(advanceBallotAndFetchMoreIfNeeded(winnerSide));
  console.log("SUBMITTING BALLOT...");
  var data = JSON.stringify({"WinnerSide" : winnerSide, "BallotID" : currentBallotID, "AuthKey": authKey});
  console.log("data:");
  console.log(data);
  return axios({
      method: 'put',
      url: "https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/ballots/",
      "data": data,
      headers: {"Content-Type": "application/json"}
    }
  )
  .then(function (response) {
    u.t("response:", 2);
    u.t_o(response);
    dispatch(confirmBallotSubmission());
  }, function (error) {
    console.log(error);
    dispatch(failBallotSubmission());
  });
}
}
export const advanceBallotAndFetchMoreIfNeeded = (winnerSide) => {
return (dispatch, getState) => {
    dispatch(advanceBallot(winnerSide));
    dispatch(fetchMoreBallotsIfNeeded(getState()));
};
};
export const fetchMoreBallots = () => {
return function(dispatch, getState) {
  console.log("FETCHING MORE BALLOTS");
  dispatch(requestMoreBallots());
  var state = getState();
  var authKey = state.authkey.key;
  return axios
    .get(
        "https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/ballots?authkey=" + encodeURIComponent(authKey)
    )
    .then(function (response) {
      console.log("RECEIVED MORE BALLOTS")
      console.log("response:");
      console.log(response);
      var newBallots = response.data;
      return dispatch(receiveMoreBallots(newBallots));
    }, function (error) {
      return dispatch(failReceiveMoreBallots());
    });
}};
export const fetchMoreBallotsIfNeeded = () => {
return (dispatch, getState) => {
  if (shouldFetchMoreBallots(getState())) {
    return dispatch(fetchMoreBallots());
  } else {
    return Promise.resolve();
  }
}
}
export const fetchBallotsAndAnimalsIfNeeded = () => {
return function (dispatch, getState) {
  store.dispatch(fetchLatestAnimalsIfNeeded());
  store.dispatch(fetchMoreBallotsIfNeeded());
}
}
export const fetchAuthKey = (count) => {
return function(dispatch, getState) {
  dispatch(requestAuthKey());
  return axios
    .get(
        "https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/authkey"
    )
    .then(function (response) {
      console.log("RECEIVING AUTH KEY");
      console.log("response:");
      console.log(response);
      var authKey = response.data.AuthKey;
      return dispatch(receiveAuthKey(authKey));
    }, function (error) {
      console.log(error);
      return dispatch(failReceiveAuthKey());
    });
}};
export const fetchAuthKeyIfNeeded = () => {
return (dispatch, getState) => {
  if (shouldFetchMoreBallots(getState())) {
    return dispatch(fetchAuthKey());
  } else {
    return Promise.resolve();
  }
}
}
export const fetchLatestAnimals = () => {
return (dispatch, getState) => {
    dispatch(requestLatestAnimals);
    return axios.get('https://n6d28h0794.execute-api.us-east-1.amazonaws.com/Production/animals')
    .then(function (response) {
        console.log("FETCHING ANIMALS SUCCEEDED");
        console.log("response:");
        console.log(response);
        var body = response.data.body;
        var animalStore = JSON.parse(body.AnimalStore);
        var animalIDsInRankOrder = JSON.parse(body.AnimalIDsInRankOrder);
        dispatch(receiveLatestAnimals(animalStore, animalIDsInRankOrder));
      }, function (error){
        console.error(error);
        //dispatch(updateToLatestAnimalsFailure());
      });
    };
};
export const fetchLatestAnimalsIfNeeded = () => {
return (dispatch, getState) => {
  if (shouldFetchLatestAnimals(store.getState())) {
    return dispatch(fetchLatestAnimals());
  } else {
    return Promise.resolve();
  }
}
};

//--Reducers--

export function animals(state = {
isFetching: false,
didInvalidate: false,
animalStore: {},
rankOrder: [],
}, action
) {
switch (action.type) {
  case 'REQUEST_LATEST_ANIMALS':
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    });
  case 'RECEIVE_LATEST_ANIMALS':
    var result =  Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      animalStore: action.animalStore,
      rankOrder: action.animalIDsInRankOrder, /* TODO: Can probably do this server side? */
      lastUpdated: action.receivedAt});
    return result;
  default:
    return state;
}
}

export function ballots(state = {
isFetching: false,
didInvalidate: false,
ballotIDQueue: [],
ballotStore: {},
outgoingBallotID: null,
oldOutgoingBallotID: null,
ballotStoreGraveyard: {},
}, action) {
switch (action.type) {
  case 'ADVANCE_BALLOT':
    u.t("state (will be old):",1);
    u.t_o(state);
    var currentOutgoingBallotID = state.outgoingBallotID;

    var newIncomingID = state.ballotIDQueue[1];
    var newOutgoingID = state.ballotIDQueue[0];

    var newState = Object.assign({}, state, {
      ballotIDQueue: state.ballotIDQueue.slice(1),
      lastUpdated: action.receivedAt
    });

    var newBallot1 = Object.assign({}, newState.ballotStore[newIncomingID], {
      QueueState : QUEUE_STATE.INCOMING,
    });
    var newBallot2 = Object.assign({}, newState.ballotStore[newOutgoingID], {
      QueueState : QUEUE_STATE.OUTGOING,
      WinnerSide: action.winnerSide,
    });



    newState.ballotStore[newIncomingID] = newBallot1;
    newState.ballotStore[newOutgoingID] = newBallot2;

    if (state.oldOutgoingBallotID != null) {
      //newState.ballotStoreGraveyard[currentOutgoingBallotID] = newState.ballotStore[currentOutgoingBallotID];
      delete newState.ballotStore[state.oldOutgoingBallotID];

    }
    newState.oldOutgoingBallotID = currentOutgoingBallotID;
    newState.outgoingBallotID = newOutgoingID;



    u.t("newState:",1);
    u.t_o(newState);
    return newState;
  case 'REQUEST_MORE_BALLOTS':
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    });
  case 'RECEIVE_MORE_BALLOTS':
    var newState_receive = Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      ballotIDQueue: state.ballotIDQueue.concat(_extractBallotIDs(action.ballots)),
      ballotStore: _storeAndPrepNewBallots(state.ballotStore, action.ballots),
      lastUpdated: action.receivedAt
    });

    //--Mark the items in ballot queue with appropriate queueState, if they aren't already.

    var newIncomingID_receive = newState_receive.ballotIDQueue[0];

    var newBallot1_receive = Object.assign({}, newState_receive.ballotStore[newIncomingID_receive], {
      QueueState : QUEUE_STATE.INCOMING,
    });

    newState_receive.ballotStore[newIncomingID_receive] = newBallot1_receive;
    return newState_receive;

  default:
    return state;
}
}
function _storeAndPrepNewBallots(ballotStore, newBallots) {
var newBallotStore = Object.assign({}, ballotStore, {
}); //TODO: Better way to copy?
  for (var i = 0; i < newBallots.length; i++) {
    var newBallot = newBallots[i];
    newBallot.QueueState = QUEUE_STATE.HIDDEN; //TODO: Should this be elsewhere
    var newBallotID = newBallot.ID
    newBallotStore[newBallotID] = newBallot;
}
    return newBallotStore;
}
function _extractBallotIDs(newBallots) {
var newBallotIDs = newBallots.map((newBallot) => {return newBallot.ID});
return newBallotIDs;
}

export function authkey (state = {
isFetching: false,
didInvalidate: false,
key: null
}, action) {
switch (action.type) {
  case 'RECEIVE_AUTH_KEY':
    action.asyncDispatch(fetchBallotsAndAnimalsIfNeeded());
    return Object.assign({}, state, {
      isFetching: false,
      key: action.key,
      lastUpdated: action.receivedAt
  });
  case 'REQUEST_AUTH_KEY':
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    });
    //TODO: Fail state
  default:
    return state;
}
}



export function ui (state = {
focusArea : FOCUSAREA.INITIAL,
ballotBoxShouldBeJumping: false,
rulesVisibilityState: "hidden",
resultsPanelStepInProcess: "show",
}, action) {
switch (action.type) {
  case 'SHOW_RANKINGS':
  console.log(state.focusArea);
  console.log("SHOW RANKINGS");
    return Object.assign({}, state, {
      focusArea: FOCUSAREA.RANKINGS
  });
  case 'HIDE_RANKINGS':
    return Object.assign({}, state, {
      focusArea: FOCUSAREA.BALLOTVIEWER
    });
    //TODO: Fail state
  case 'ADVANCE_BALLOT':
      action.asyncDispatch(clearBallotBoxJumpingAfterDelay(1400)); /* Keep in sync with jump animation times */
      action.asyncDispatch(changeResultsPanelToShowAfterDelay(1500));
      var newState =  Object.assign({}, state, {
      ballotBoxShouldBeJumping: true,
        resultsPanelStepInProcess: "rewrite" //TODO: Make a constant
      });
      return newState;
  case 'CHANGE_RESULTS_PANEL_TO_SHOW':
    return Object.assign({}, state, {
        resultsPanelStepInProcess: "show",
    });

  case 'CLEAR_BALLOT_BOX_JUMPING':
  return Object.assign({}, state, {
      ballotBoxShouldBeJumping: false,
    });
  case 'SHOW_RULES':
    console.log("IN SHOW RULES REDUCER");
    var newState_showRules = Object.assign({}, state, {
      rulesVisibilityState: "visible",
    });
    console.log("newState:");
    console.log(newState_showRules);
    return newState_showRules ;
  case 'HIDE_RULES':
    return Object.assign({}, state, {
      rulesVisibilityState: "hidden",
    });
  default:
      return state;
}
}

export const FOCUSAREA = {
  INITIAL : "show_initial",
  BALLOTVIEWER: "show_ballots",
  RANKINGS: "show_rankings"
};



//--Utility-functions--

function checkNested(obj /*, level1, level2, ... levelN*/) {
var args = Array.prototype.slice.call(arguments, 1);

for (var i = 0; i < args.length; i++) {
  if (!obj || !obj.hasOwnProperty(args[i])) {
    return false;
  }
  obj = obj[args[i]];
}
return true;
}
//
// function rankAnimals(animalsMap) {
//   var animalKeys = Object.keys(animalsMap);
//   var animals = [];
//   for (let animalKey of animalKeys) {
//     var animal = animalsMap[animalKey];
//     animal.ID = animalKey;
//     animals.push(animal);
//   }
//   animals.sort(function (a, b) {
//     var ratio_animal_a = (a.Wins + 1) / (a.Losses + 1);
//     var ratio_animal_b = (b.Wins + 1) / (b.Losses + 1);
//     if (ratio_animal_a === ratio_animal_b) {
//       var alphabeticalOrder = [a.Name, b.Name].sort();
//       if (alphabeticalOrder[0] === a.Name) {
//         return -1;
//       } else {
//         return 1;
//       }
//     } else {
//       if (ratio_animal_b > ratio_animal_a) {
//         return 1;
//       } else if (ratio_animal_b < ratio_animal_a) {
//         return -1;
//       } else {
//         return 0;
//       }
//     }
//   });
//   var animalsIDSorted = animals.map(function(animal) {return animal.ID});
//   return animalsIDSorted;
// }

const shouldFetchLatestAnimals = (state) => {
//TODO: Add refresh based on time
  if (Object.keys(state.animals.animalStore).length === 0) {
    return true;
  } else {
    return false;
  }
}
const shouldFetchMoreBallots= (state) => {
    if (checkNested(state, "ballots", "ballotStore")) {
      return (state.ballots.ballotIDQueue.length <= 5 && state.ballots.isFetching === false)
    } else {
      return true;
    }
}

//--Root Reducer--

const rootReducer = Redux.combineReducers({
"animals": animals,
"ballots": ballots,
"authkey": authkey,
"ui": ui
})
//--Store--

function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}
// This middleware will just add the property "async dispatch"
// to actions with the "async" property set to true
const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch =
    Object.assign({}, action, { asyncDispatch });

  const res = next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
  return res;
};

export const store = Redux.createStore(rootReducer, Redux.applyMiddleware(createThunkMiddleware(), asyncDispatchMiddleware));

//--Constants--

const QUEUE_STATE = {
HIDDEN : "hidden",
INCOMING: "incoming",
OUTGOING: "outgoing"
}

//--Utilities--

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
