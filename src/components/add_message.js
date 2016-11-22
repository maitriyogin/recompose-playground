import React from 'react';
import { compose, withHandlers, withState } from 'recompose';

const AddMessage = ({newMessage, handleUpdateNewMessage, handleAddNewMessage}) => <input
  key='message_add'
  className='message_add'
  type='text'
  onChange={handleUpdateNewMessage}
  onKeyDown={handleAddNewMessage}
  value={newMessage}
/>;

const AddMessageWithState = compose(
  withState('newMessage', 'setNewMessage', undefined),
  withHandlers({
    handleUpdateNewMessage: ({newMessage, setNewMessage}) => event => setNewMessage(event.target.value),
    handleAddNewMessage: ({handleAddMessage, newMessage}) => event => {
      if (event.which === 13) {
        // handleAddMessage is passed down from chat_list_container
        handleAddMessage(newMessage);
      }
    }
  })
)(AddMessage);

export default AddMessageWithState;