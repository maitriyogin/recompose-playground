import * as api from '../api';
// --- actions
export const all = {
  type: 'all'
};

// --- requests
export const requestMessages = () => ({
  type: 'REQUEST_MESSAGES'
});

// also used in messages reducer
// const receiveMessages = response => ({
//   type: 'RECEIVE_MESSAGES',
//   response,
// });

// --- messages
export const updateMessage = (id, message) => ({
  type: 'UPDATE_MESSAGE',
  id,
  message
});
export const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
});
export const deleteMessage = id => ({
  type: 'DELETE_MESSAGE',
  id
});
export const receiveMessages = messages => ({
  type: 'RECEIVE_MESSAGES',
  messages
});

// --- message
export const editMessage = id => ({
  type: 'EDIT_MESSAGE',
  id
});
export const clearEditMessage = () => ({
  type: 'CLEAR_EDIT_MESSAGE'
});

// thunks
export const fetchChats = () =>
  api.fetchChats().then(response => response);

