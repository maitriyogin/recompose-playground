import React, {PropTypes} from 'react';
import ChatItem from './chat_item'
const ChatList = ({messages, ...props}) => (
  <div>

    <ul>
      {messages.map(message => {
        return <li key={message.id}><ChatItem {...{...props, message}} /></li>
      })}
    </ul>
  </div>
);

ChatList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string
  }).isRequired).isRequired
};

export default ChatList;
