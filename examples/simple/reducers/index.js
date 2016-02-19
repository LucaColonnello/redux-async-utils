import { combineReducers } from 'redux';
import { asyncActionsState } from 'redux-async-utils';
import simpleDataList from './simpleDataList';


const rootReducer = combineReducers({
  simpleDataList,
  asyncActionsState,
});


export default rootReducer;
