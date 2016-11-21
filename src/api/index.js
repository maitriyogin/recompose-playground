import { v4 } from 'node-uuid';

// This is a fake in-memory implementation of something
// that would be implemented by calling a REST server.

const fakeDatabase = {
  chatList: [{
    id: v4(),
    message: 'hey'
  }, {
    id: v4(),
    message: 'ho'
  }, {
    id: v4(),
    message: 'let’s go',
  }],
};

const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const fetchChats = (filter = 'all') =>
  delay(3000).then(() => {
    console.log('----- fakedb', fakeDatabase.chatList);
    return fakeDatabase.chatList;
  });

