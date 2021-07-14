import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import events from "./events";

const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const socketRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("https://api.randomuser.me/");
      const result = response.data.results[0];
      setUser({
        name: result.name.first
      });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        `${SOCKET_SERVER_URL}/rooms/${roomId}/users`
      );
      const result = response.data.users;
      setUsers(result);
    };

    fetchUsers();
  }, [roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(
        `${SOCKET_SERVER_URL}/rooms/${roomId}/messages`
      );
      const result = response.data.messages;
      setMessages(result);
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (!user) {
      return;
    }
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, name: user.name},
    });

    socketRef.current.on("connect", () => {
      console.log(socketRef.current.id);
    });

    socketRef.current.on(events.NEW_USER_EVT, (user) => {
      if (user.id === socketRef.current.id) return;
      setUsers((users) => [...users, user]);
      let oldTitle = document.title;
      document.title = `New user has joined`;
      setTimeout(() => {
        document.title = oldTitle;
      }, 4000);
    });

    socketRef.current.on(events.PERSON_LEFT_EVT, (user) => {
      setUsers((users) => users.filter((u) => u.id !== user.id));
    });

    socketRef.current.on(events.NEW_MESSAGE_EVT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, user]);

  const sendMessage = (messageBody) => {
    if (!socketRef.current) return;
    socketRef.current.emit(events.NEW_MESSAGE_EVT, {
      body: messageBody,
      senderId: socketRef.current.id,
      user: user,
    });
  };

  return {
    messages,
    user,
    users,
    sendMessage
  };
};

export default useChat;
