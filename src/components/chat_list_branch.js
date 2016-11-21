import React from 'react';
import {branch} from 'recompose';
import ChatList from './chat_list';
import Waiting from './waiting';

export default
  branch(
    ({chats}) => !chats || chats.length === 0,
    () => props => <Waiting {...props} />,
    () => props => <ChatList {...props} />
  )(bc => props => bc);
