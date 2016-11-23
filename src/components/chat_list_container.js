import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import { compose, withHandlers, withReducer, lifecycle} from 'recompose';
import * as api from '../api';
import {messageSelectors} from '../reducers';
// import {list, editing, isFetching, stateMessage, stateMessages, requestState} from '../reducers/messages';
import ChatListBranch from './chat_list_branch';
import * as actions from '../actions';

const ChatListContainer = props =>
  <div style={{margin: '40px'}}>
    <h1>Chat App</h1>
    <ChatListBranch {...props}/>
  </div>;

const mapStateToProps = (state, {params}) => ({
  messages: messageSelectors.getMessages(state),
  isFetching: messageSelectors.getIsFetching(state),
  editingState: state.messages.editing
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
  // withReducer('messages', 'dispatchToMessages',
    // list, []),
  // withReducer('editingState', 'dispatchToMessage',
    // editing, stateMessage),
  // withReducer('isFetching', 'dispatchToIsFetching',
    // isFetching, false),
  connect(
    mapStateToProps,
    actions
  ),
  withHandlers({
      handleAddMessage: ({addMessage}) => newMessage => addMessage(newMessage),
      handleUpdateMessage: ({clearEditMessage, updateMessage}) => id => event => {
        if (event.which === 13) {
          // dispatchToMessage(clearEditMessage());
          clearEditMessage();
        } else {
          updateMessage(id, event.target.value);
        }
      },
      handleDeleteMessage: ({deleteMessage}) => id => () => deleteMessage(id),
      handleEditMessage: ({editMessage}) => id => () => editMessage(id),
      handleRequestChats: ({requestMessages, receiveMessages}) => () => {
        requestMessages();
        api.fetchChats().then(messages => {
          receiveMessages(messages);
        })
      }
    }
  ),

  _lifecycle,
)(ChatListContainer);
