import * as api from '../api';
// --- actions
export const all = {
  type: 'all'
};

export const requestChats = () => ({
  type: 'REQUEST_CHATS'
});

const receiveChats = response => ({
  type: 'RECEIVE_CHATS',
  response,
});

export const updateMessage = message => ({
  type: 'UPDATE_MESSAGE',
  message 
});

export const addMessage = ({message}) => ({
  type: 'ADD_MESSAGE',
  message
});

export const fetchChats = () =>
  api.fetchChats().then(response =>
    receiveChats(response)
  );

