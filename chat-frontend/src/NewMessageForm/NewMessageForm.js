import React from "react";
import "./NewMessageForm.css";

const NewMessageForm = ({
  newMessage,
  handleNewMessageChange,
  handleSendMessage,
}) => {
  return (
    <form className="new-message-form">
      <input
        type="text"
        value={newMessage}
        onChange={handleNewMessageChange}
        className="new-message-input-field"
      />
      <button
        type="submit"
        onClick={handleSendMessage}
        className="send-message-button"
      >
        Send
      </button>
    </form>
  );
};

export default NewMessageForm;
