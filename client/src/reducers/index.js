import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import notebookReducer from './notebookReducer';
import notedirReducer from './notedirReducer';
import noteReducer from './noteReducer';
import recyclebinReducer from './recyclebinReducer';

export default combineReducers({
    alerts: alertReducer,
    notebooks: notebookReducer,
    notedirs: notedirReducer,
    notes: noteReducer,
    recyclebins: recyclebinReducer
});