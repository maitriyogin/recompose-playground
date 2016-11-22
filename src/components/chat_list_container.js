import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import { compose, withHandlers, withReducer, lifecycle} from 'recompose';
import {chatSelectors} from '../reducers';
import {list, editing, isFetching, stateMessage, stateMessages, requestState} from '../reducers/messages';
import ChatListBranch from './chat_list_branch';
import {updateMessage, addMessage, deleteMessage, receiveMessages, editMessage, clearEditMessage, fetchChats, requestMessages} from '../actions';

const ChatListContainer = props =>
  <div style={{margin: '40px'}}>
    <h1>Chat App</h1>
    <ChatListBranch {...props}/>
  </div>;

const mapStateToProps = (state, {params}) => ({
  chats: chatSelectors.getMessages(state)
});

const _lifecycle = lifecycle({
  componentDidMount() {
    this.props.handleRequestChats();
  },
  componentWillReceiveProps(props) {
  }
});

export default compose(
  withRouter,
  withReducer('messages', 'dispatchToMessages',
    list, []),
  withReducer('editingState', 'dispatchToMessage',
    editing, stateMessage),
  withReducer('isFetching', 'dispatchToIsFetching',
    isFetching, false),
  withHandlers({
      handleAddMessage: ({dispatchToMessages}) => newMessage => dispatchToMessages(addMessage(newMessage)),
      handleUpdateMessage: ({dispatchToMessages, dispatchToMessage}) => id => event => {
        if (event.which === 13) {
          dispatchToMessage(clearEditMessage());
        } else {
          dispatchToMessages(updateMessage(id, event.target.value))
        }
      },
      handleDeleteMessage: ({dispatchToMessages}) => id => () => dispatchToMessages(deleteMessage(id)),
      handleEditMessage: ({dispatchToMessage}) => id => () => dispatchToMessage(editMessage(id)),
      handleRequestChats: ({dispatchToIsFetching, dispatchToMessages}) => () => {
        dispatchToIsFetching(requestMessages());
        fetchChats().then(actionReceiveMessages => {
          dispatchToMessages(actionReceiveMessages);
          dispatchToIsFetching(actionReceiveMessages);
        })
      }
    }
  ),
  _lifecycle
  // connect(
  //   mapStateToProps,
  //   actions
  // ),
  // _lifecycle,
)(ChatListContainer);
