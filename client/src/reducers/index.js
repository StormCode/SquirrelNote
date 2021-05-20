import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import notebookReducer from './notebookReducer';

export default combineReducers({
    alerts: alertReducer,
    notebooks: notebookReducer
});