import { combineReducers } from 'redux';
import {default as messages} from './messages';
export {selectors as chatSelectors} from './messages';

const messageBoard = combineReducers({
  messages,
});

export default messageBoard;

