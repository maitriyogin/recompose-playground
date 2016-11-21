import {combineReducers} from 'redux';
import { v4 } from 'node-uuid';

const initialState = [
  {
    id: '1',
    message: 'hi'
  }
];

export const message = (state, action) => {
  switch (action.type) {
    case 'UPDATE_MESSAGE' :
      return state.map(chat => chat.id === action.chat.id ? action.chat : chat);
    case 'ADD_MESSAGE' :
      return [...state, {id: v4(), message: action.message}];
    default :
      return state;
  }
};

export const list = (state = [], action = {type: ''}) => {
  switch (action.type) {
    case 'all' :
      return state;
    case 'RECEIVE_CHATS':
      return action.response;
    default :
      return message(state, action);
  }
};

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case 'REQUEST_CHATS':
      return true;
    case 'RECEIVE_CHATS':
      return false;
    default:
      return state;
  }
};

export default combineReducers({list, isFetching});

// --- selectors
const getChats = state => state.messages.list;

const getIsFetching = state => state.messages.isFetching;

export const selectors = {
  getChats,
  getIsFetching
};
