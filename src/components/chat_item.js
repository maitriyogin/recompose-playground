import React from 'react';
import {compose, withProps, branch, renderComponent} from 'recompose';

// --- ChatItem components
export const EditableChatItem = ({message, handleUpdateMessage}) => <input
  key={`message_edit_${message.id}`}
  id={`message_edit_${message.id}`}
  type='text'
  value={message.message}
  onChange={handleUpdateMessage(message.id)}
  onKeyDown={handleUpdateMessage(message.id)}
/>;

export const LinkChatItem = ({message, handleEditMessage}) => <a
  href='#'
  onClick={handleEditMessage(message.id)}
  key={`message_${message.id}`}
  id={`message_${message.id}`}
>{message.message}</a>;

// --- using branch to do control which component is shown based on the editing state.
export const BranchedChatItem = compose(
  withProps(ownProps => ({
    isEditing: ownProps.message && ownProps.editingState
    && ownProps.message.id === ownProps.editingState.id
  })),
  branch(
    ({isEditing}) => isEditing,
    c => c,
    renderComponent(LinkChatItem)
  )
)(EditableChatItem);

export const DeleteChatItem = ({message, handleDeleteMessage}) => <button
  className='message_delete'
  key={`message_delete_${message.id}`}
  id={`message_delete_${message.id}`}
  onClick={handleDeleteMessage(message.id)}
>
  delete
</button>

export const ChatItem = ({message, ...rest}) => <li
  id={`message-${message.id}`}
  key={message.id}
>
  <BranchedChatItem message={message} {...rest} />
  <DeleteChatItem message={message} {...rest}/>
</li>;

  export default ChatItem;