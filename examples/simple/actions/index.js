import {
  createActionCreatorFromPromise,
} from 'redux-async-utils';

// error factor
const errorFactor = 4;

// actions type
export const INVALIDATE_ALL = 'INVALIDATE_ALL';
export const ADD = 'ADD';
export const UPDATE = 'UPDATED';
export const REMOVE = 'REMOVE';
export const SET = 'SET';

// async key used to store the state of the async operation
// better if it's a simple string in order to prevent rehydratation problem
// you can't rehydrate a Symbol from the server (if you can, ping me on GitHub!!)
export const ADD_ASYNC = 'ADD_ASYNC';
export const REMOVE_ASYNC = 'REMOVE_ASYNC';
export const SET_ASYNC = 'SET_ASYNC';
export const ASYNC_ACTIONS_GROUP = 'ASYNC_ACTIONS_GROUP';

// use a key generator to get uniqueness based on an id
export const createAsyncUpdateKey =
id => ({ key: `UPDATE_ASYNC_${id}`, group: ASYNC_ACTIONS_GROUP });


// add action creator
export const addActionCreator = createActionCreatorFromPromise(
  { key: ADD_ASYNC, group: ASYNC_ACTIONS_GROUP },

  // get promise function
  () => new Promise((resolve, reject) => {
    setTimeout(() => {
      // randomly give an error
      if (parseInt((Math.random() * 100), 10) % errorFactor) {
        resolve('new item added');
      } else {
        reject(new Error('Random error on add'));
      }
    }, 3000);
  }),
  (data) => ({ type: ADD, data })

  // this action is locked only when other ADD_ASYNC async actions are in pending
);

// update action creator
export const updateActionCreator = createActionCreatorFromPromise(
  // create key from index
  // index is a parameter passed by the call at updateActionCreator
  // same as index => createAsyncUpdateKey(index),
  createAsyncUpdateKey,

  // get promise function
  () => new Promise((resolve, reject) => {
    setTimeout(() => {
      // randomly give an error
      if (parseInt((Math.random() * 100), 10) % errorFactor) {
        resolve();
      } else {
        reject(new Error('Random error on update'));
      }
    }, 3000);
  }),

  // res is null because the promise gives nothing
  // you also receive the parameters passed to the action creator
  (index, data) => ({ type: UPDATE, data, index }),

  // is locked if a remove async action is in pending
  REMOVE_ASYNC,
);

// remove action creator
export const removeActionCreator = createActionCreatorFromPromise(
  { key: REMOVE_ASYNC, group: ASYNC_ACTIONS_GROUP },

  // get promise function
  // this receive all the parameters passed to the action creator and getState function
  (dispatch, getState) => new Promise((resolve, reject) => {
    setTimeout(() => {
      // randomly give an error
      if (parseInt((Math.random() * 100), 10) % errorFactor) {
        resolve((getState().simpleDataList.length) - 1);
      } else {
        reject(new Error('Random error on remove'));
      }
    }, 3000);
  }),

  // this receive the response of the promise (in case of resolve) and
  // all the parameters passed to the action creator
  (index) => ({ type: REMOVE, index }),

  // is locked if another state of the group is in pending
  { group: ASYNC_ACTIONS_GROUP },
);

// set action creator
export const setActionCreator = createActionCreatorFromPromise(
  { key: SET_ASYNC, group: ASYNC_ACTIONS_GROUP },

  // get promise function
  () => new Promise((resolve, reject) => {
    setTimeout(() => {
      // randomly give an error
      if (parseInt((Math.random() * 100), 10) % errorFactor) {
        // generate random array
        resolve(Array(parseInt((Math.random() * 20), 10)).join('|').split('|').map((v, i) => i));
      } else {
        reject(new Error('Random error on set'));
      }
    }, 3000);
  }),

  (data) => ({ type: SET, data }),

  // is locked if another state of the group is in pending
  { group: ASYNC_ACTIONS_GROUP },
);

/*
// long version
export const updateActionCreator = (index, data) => (dispatch) => {
  // dispatch pending for ASYNC_UPDATE_ID
  const ASYNC_UPDATE_ID = createAsyncUpdateKey(index);
  dispatch(pendingActionCreator(ASYNC_UPDATE_ID, 'ASYNC_UPDATE'));

  setTimeout(() => {
    // randomly give an error
    const action = (
      (parseInt((Math.random() * 100), 10) % errorFactor) ?

      doneActionCreator(
        ASYNC_UPDATE_ID,
        { type: UPDATE, data, index }
      ) :

      failureActionCreator(
        ASYNC_UPDATE_ID,
        new Error('Random error on update')
      )
    );

    dispatch(action);
  }, 3000);
};
*/
