import React from "react";

import "./ChatMessage.css";

const ChatMessage = ({ message }) => {
  return (
    <div
      className={`message-item ${
        message.ownedByCurrentUser ? "my-message" : "received-message"
      }`}
    >
      {!message.ownedByCurrentUser && (
        <div className="message-body-container">
          <div className="message-body">{message.user.name}:</div>
        </div>
      )}

      <div className="message-body-container">
        <div className="message-body bg-tr">{message.body}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
