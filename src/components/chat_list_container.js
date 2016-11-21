import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {chatSelectors} from '../reducers';
import ChatListBranch from './chat_list_branch';
import ChatMessage from './chat_message';


import * as actions from '../actions';
import {compose, lifecycle} from 'recompose';

const ChatListContainer = props =>
  <div style={{margin: '40px'}}>
    <h1>Chat App</h1>
    <ChatMessage {...props}/>
    <ChatListBranch {...props}/>
  </div>;

const mapStateToProps = (state, {params}) => ({
  chats: chatSelectors.getChats(state)
});

const _fetchData = ({requestChats, fetchChats}) => {
  requestChats();
  fetchChats();
};

const _lifecycle = {
  componentDidMount() {
    _fetchData(this.props);
  },
  componentWillReceiveProps(props) {
  }
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    actions
  ),
  lifecycle(_lifecycle),
)(ChatListContainer);
