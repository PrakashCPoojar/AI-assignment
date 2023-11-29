// Chat.js
import React from 'react';

const Chat = ({ chatResponses }) => {
  return (
    <div className="chat-container">
      {chatResponses.map((chat, index) => (
        <div key={index} className={chat.user ? 'user-message' : 'bot-message'}>
          {chat.user && <p>User: {chat.user}</p>}
          <p>Bot: {chat.bot}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;
