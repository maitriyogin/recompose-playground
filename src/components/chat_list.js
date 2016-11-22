import React, {PropTypes} from 'react';
import ChatItem from './chat_item';
import AddMessageWithState from './add_message';

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

ChatList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string
  }).isRequired).isRequired
};

export default ChatList;
