import React from 'react';
import { compose, withHandlers, withReducer, withState, withProps, branch, renderComponent } from 'recompose';
import { v4 } from 'node-uuid';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';

// --- actions
// --- messages
const updateMessage = (id, message) => ({
  type: 'UPDATE_MESSAGE',
  id,
  message
});
const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
});
const deleteMessage = id => ({
  type: 'DELETE_MESSAGE',
  id
});
const receiveMessages = messages => ({
  type: 'RECEIVE_MESSAGES',
  messages
});

// --- message
const editMessage = id => ({
  type: 'EDIT_MESSAGE',
  id
});
const clearEditMessage = () => ({
  type: 'CLEAR_EDIT_MESSAGE'
});

// --- ChatItem components
const EditableChatItem = ({message, handleUpdateMessage}) => <input
  key={`message_edit_${message.id}`}
  id={`message_edit_${message.id}`}
  type='text'
  value={message.message}
  onChange={handleUpdateMessage(message.id)}
  onKeyDown={handleUpdateMessage(message.id)}
  />;

const LinkChatItem = ({message, handleEditMessage}) => <a
  href='#'
  onClick={handleEditMessage(message.id)}
  key={`message_${message.id}`}
  id={`message_${message.id}`}
  >{message.message}</a>;

// --- using branch to do control which component is shown based on the editing state.
const BranchedChatItem = compose(
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

const DeleteChatItem = ({message, handleDeleteMessage}) => <button
  className='message_delete'
  key={`message_delete_${message.id}`}
  id={`message_delete_${message.id}`}
  onClick={handleDeleteMessage(message.id)}
  >
      delete
    </button>

const ChatItem = ({message, ...rest}) => <li
  id={`message-${message.id}`}
  key={message.id}
  >
    <BranchedChatItem message={message} {...rest} />
    <DeleteChatItem message={message} {...rest}/>
  </li>;
  // --------

// --- Chat List components
const AddMessage = ({newMessage = '', handleUpdateNewMessage, handleAddNewMessage}) => <input 
  key='message_add'
  className='message_add' 
  type='text'
  onChange={handleUpdateNewMessage}
  onKeyDown={handleAddNewMessage}
  value={newMessage}
  />

const AddMessageWithState = compose(
  withState('newMessage', 'setNewMessage', undefined),
  withHandlers({
    handleUpdateNewMessage: ({newMessage, setNewMessage}) => event => setNewMessage(event.target.value),
    handleAddNewMessage: ({newMessage, dispatchToMessages, dispatchToMessage}) => event => {
      console.log('--- add new message', newMessage);
      if (event.which === 13) {
        dispatchToMessages(addMessage(newMessage))
      }
    }
  })
)(AddMessage);

const ChatList = ({messages, ...rest}) => {
  return <div>
    <AddMessageWithState {...rest} />
    <ul className='messages'>
    {messages.map(
      message => {
        return <ChatItem key={`ci-${message.id}`} message={message} {...rest}/>
      })
    }
    </ul>
    
    </div>;
};

describe('----------- withReducer', () => {

  const stateMessages = [
    {
      id: 1,
      message: 'wake up'
    },
    {
      id: 2,
      message: 'bagpuss oh here what I sing!'
    },
    {
      id: 3,
      message: 'we will fix it'
    },
    {
      id: 4,
      message: 'gabrielle the frog'
    },
  ];

  const stateMessage = {
    id: undefined,
    isEditing: false
  }

  const requestState = {
    isLoading: false,
    error: undefined
  };

  it('can reduce a chat list', () => {
    // --- compose
    const Composed = compose(
      withReducer('messages', 'dispatchToMessages',
        (state, action) => {
          console.log('-------------- messages');
          console.log('--- action', action);
          console.log('-----------------------');
          switch (action.type) {
            case 'REQUEST_MESSAGES':
              return [...state]
            case 'UPDATE_MESSAGE':
              return state.map(message => message.id === action.id ? {
                ...message,
                message: action.message
              } : message);
            case 'DELETE_MESSAGE':
              return state.filter(message => message.id !== action.id);
            case 'ADD_MESSAGE':
              return [...state, {
                id: v4(), 
                message: action.message
              }];
            case 'RECEIVE_MESSAGES':
              return [...action.messages];
            default:
              return state;
          }
        },
        stateMessages
      ),
      withReducer('editingState', 'dispatchToMessage',
        (state, action) => {
          console.log('-------------- editingMessage');
          console.log('--- action', action);
          console.log('-----------------------');
          switch (action.type) {
            case 'EDIT_MESSAGE':
              return {
                ...state,
                id: action.id,
                isEditing: true
              };
            case 'CLEAR_EDIT_MESSAGE':
              return {
                id: undefined,
                isEditing: false
              };
            default:
              return state;
          }
        }
      ),
      withHandlers({
        handleAddMessage: ({dispatchToMessages}) => event => dispatchToMessages(addMessage(event.target.value)),
        handleUpdateMessage: ({dispatchToMessages, dispatchToMessage}) => id => event => {
          console.log('--- id, message', id, event.target.value);
          if (event.which === 13) {
            dispatchToMessage(clearEditMessage());
          } else {
            dispatchToMessages(updateMessage(id, event.target.value))
          }
        },
        handleDeleteMessage: ({dispatchToMessages}) => id => () => dispatchToMessages(deleteMessage(id)),
        handleEditMessage: ({dispatchToMessage}) => id => () => dispatchToMessage(editMessage(id))
      }
      )
    )(ChatList);
    const props = {
      prop1: 'fred'
    };
    // have to go over to mount here as handlers infers another component
    const result = mount(<Composed {...props} />);
    expect(result).to.have.length(1);
    expect(result.find('.messages').children()).to.have.length(stateMessages.length);

    // so now we have our messages we can start firing off actions

    // 1. delete message 1
    result.find('#message_delete_1').simulate('click');
    result.update();
    // important to note that the original state is not being mutated       
    expect(result.find('.messages').children()).to.have.length(stateMessages.length - 1);

    // 2. edit message 2 
    result.find('#message_2').simulate('click');
    result.update();
    expect(result.find('#message_edit_2')).to.have.length(1);

    // 3. update message
    result.find('#message_edit_2').simulate('change', {
      target: {
        value: 'wow this is all in a test!'
      }
    });
    result.find('#message_edit_2').simulate('keyDown', {
      which: 13
    });
    result.update();
    expect(result.find('#message_edit_2')).to.have.length(0);
    expect(result.find('#message_2')).to.have.length(1);
    expect(result.find('#message_2 a').text()).to.equal('wow this is all in a test!');

    // 4. add message
    result.find('.message_add').simulate('change', {
      target: {
        value: 'the mice on the mouse organ'
      }
    });
    result.find('.message_add').simulate('keyDown', {
      which: 13
    });
    result.update();
    expect(result.find('.messages').children()).to.have.length(4);
    expect(result.find('a').last().text()).to.equal('the mice on the mouse organ');

  });
});
