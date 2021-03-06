import {
  ASYNC_UTILS_MARKER,
  ASYNC_UTILS_STATE,
  ASYNC_UTILS_STATE_FOR,
  ASYNC_UTILS_STATE_GROUP,
  PENDING,
  DONE,
  FAILURE,
  INVALIDATED,
} from './constants';

export const initialState = {
  asyncActionsStates: [],
  indexes: {},
  groups: {},
  errorsCount: 0,
  successCount: 0,
  failedActionsIndexes: [],
  digested: 0,
};

export default function asyncActionsState(state = initialState, action = {}) {
  let newState = state;

  if (action[ASYNC_UTILS_MARKER]) {
    const asyncState = action[ASYNC_UTILS_STATE];
    const error = action.error || null;
    const asyncStateFor = action[ASYNC_UTILS_STATE_FOR];
    const asyncStateGroup = action[ASYNC_UTILS_STATE_GROUP];
    let previousState;

    let index;

    newState = {
      asyncActionsStates: state.asyncActionsStates.slice(0),
      indexes: { ...state.indexes },
      groups: { ...state.groups },
      errorsCount: state.errorsCount,
      failedActionsIndexes: state.failedActionsIndexes.slice(0),
      successCount: state.successCount,
      digested: state.digested,
    };

    // look for asyncState in indexes
    if (typeof newState.indexes[asyncStateFor] !== 'undefined') {
      index = newState.indexes[asyncStateFor];
      previousState = Object.assign({}, newState.asyncActionsStates[index]);
    } else {
      // search in the array and create indexes
      newState.asyncActionsStates.forEach((v, i) => {
        if (v[ASYNC_UTILS_STATE_FOR] === asyncStateFor) {
          index = i;
          previousState = Object.assign({}, newState.asyncActionsStates[index]);
        }

        newState.indexes[v[ASYNC_UTILS_STATE_FOR]] = i;
      });
    }

    // if a pending action become INVALIDATED before being completed,
    // when DONE or FAILURE state will be dispatched
    // simply ignore them
    if (
      previousState &&
      asyncState !== PENDING &&
      previousState.state === INVALIDATED
    ) {
      return newState;
    }

    // create new
    if (typeof index === 'undefined') {
      const newActionState = {
        [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
        state: asyncState,
        error,
      };
      newState.asyncActionsStates.push(newActionState);

      // save index
      newState.indexes[asyncStateFor] = newState.asyncActionsStates.length - 1;
      index = newState.asyncActionsStates.length - 1;

      // save in group
      if (asyncStateGroup) {
        if (!newState.groups[asyncStateGroup]) {
          newState.groups[asyncStateGroup] = [index];
        } else {
          newState.groups[asyncStateGroup] = newState.groups[asyncStateGroup].slice(0);
          newState.groups[asyncStateGroup].push(index);
        }
      }
    } else {
      newState.asyncActionsStates[index] = {
        [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
        state: asyncState,
        error,
      };
    }

    // if an async action was digested and a new pending action is requested,
    // reset digested, successCount and errorsCount as the action was never requested before
    if (
      previousState &&

      // prevent variables reset in case of simple passage from PENDING to other state
      // in that case the action has to be digested yet
      previousState.state !== PENDING &&

      // prevent pending action dispatched twice
      previousState.state !== asyncState
    ) {
      if (
        asyncState !== INVALIDATED
      ) {
        newState.digested--;
      }

      if (previousState.state === DONE) {
        newState.successCount--;
      }

      if (previousState.state === FAILURE) {
        newState.errorsCount--;
        newState.failedActionsIndexes.splice(newState.failedActionsIndexes.indexOf(index), 1);
      }
    }

    // update vars
    if (asyncState === INVALIDATED && (!previousState || previousState.state === PENDING)) {
      newState.digested++;
    }

    if (asyncState === DONE && (!previousState || previousState.state !== DONE)) {
      newState.digested++;
      newState.successCount++;
    }

    if (asyncState === FAILURE && (!previousState || previousState.state !== FAILURE)) {
      newState.digested++;
      newState.errorsCount++;
      newState.failedActionsIndexes.push(index);
    }
  }

  return newState;
}
