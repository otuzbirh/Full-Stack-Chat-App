import React, { useState } from "react";

import "./ChatRoom.css";
import useChat from "../useChat";
import ChatMessage from "../ChatMessage/ChatMessage";
import NewMessageForm from "../NewMessageForm/NewMessageForm";
import Users from "../Users/Users";

const ChatRoom = (props) => {
  const { roomId } = props.match.params;
  const {
    messages,
    user,
    users,
    sendMessage,
  } = useChat(roomId);
  const [newMessage, setNewMessage] = useState("");


  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="main-container">
      <div className="chat-room-container">

        <div className="chat-room-top-bar">
          <h1 className="room-name"> Room: {roomId} </h1>
          <div className="user-name">
            {user && user.name}
          </div>
        </div>

        <div className="chat-main">
          <div className="side-bar">
            <Users users={users}></Users>
          </div>

          <div className="messages-body">
            <div className="messages-container">
              <ol className="messages-list">
                {messages.map((message, i) => (
                  <li key={i}>
                    <ChatMessage message={message}></ChatMessage>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>


        <NewMessageForm
          newMessage={newMessage}
          handleNewMessageChange={handleNewMessageChange}
          handleSendMessage={handleSendMessage}
        ></NewMessageForm>
      </div>
    </div>
  );
};

export default ChatRoom;
