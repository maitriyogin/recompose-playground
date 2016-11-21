import React from 'react';
import {compose, withState, withHandlers} from 'recompose';

export const ChatItem = ({state: {isEditing, message}, handleEdit, handleMutateMessage, handleDone}) =>
  (<span>{
    !isEditing ?
      <a href='#' onClick={handleEdit}>{message}</a> :
      <input value={message} onChange={handleMutateMessage} onKeyDown={handleDone}/> }</span>);

export default compose(
  withState('state', 'setState', ({isEditing = false, message: {id, message}}) =>
    ({isEditing, id, message})),
  withHandlers({
    handleEdit: ({state, setState}) => event =>
      setState({...state, isEditing: true}),
    handleMutateMessage: ({state, setState}) => event =>
      setState({...state, message: event.target.value}),
    handleDone: ({state, setState, updateMessage}) => event => {
      if (event.which === 13) {
        console.log(updateMessage);
        setState({...state, isEditing: false});
        updateMessage({id: state.id, message: state.message});
      }
    }
  })
)(ChatItem);
