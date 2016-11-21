import React from 'react';
import {compose, withState, withHandlers} from 'recompose';
import Warning from './warning';

const ChatMessage = ({message, handleMutateMessage, handleDone}) =>
  (<div>
    <Warning message={message}/>
    <input value={message} onChange={handleMutateMessage} onKeyDown={handleDone}/>
  </div>);

export default compose(
  withState('message', 'setMessage', ''),
  withHandlers({
    handleMutateMessage: ({setMessage}) => event =>
      setMessage(event.target.value),
    handleDone: ({message, setMessage, addMessage}) => event => {
      if (event.which === 13) {
        addMessage({message});
        setMessage('');
      }
    }
  })
)(ChatMessage);
