import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { io } from "socket.io-client";

export const ChatContext = createContext();

const backendurl = import.meta.env.VITE_BACKEND_URL;

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState(0);

  const { socket, userData, setSocket, setOnlineUsers } =
    useContext(UserContext);

  useEffect(() => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendurl, {
      query: { userId: userData._id },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("Socket connected");
      setOnlineUsers(userIds);
    });

    newSocket.on("newMessage", (data) => {
      console.log("New message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(newSocket);
  }, [users]);

  const getMessages = async () => {
    try {
      if (selectedChat.length === 0) {
        setMessages([]);
        return;
      }
      const { data } = await axios.get(
        `${backendurl}/api/chat/getmsg/${String(selectedChat._id)}`,
        { withCredentials: true }
      );

      if (data.success) {
        setMessages(data.messages);
      } else {
        console.log("Error: ", data.message);
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const { data } = await axios.get(
        `${backendurl}/api/chat/markasread/${messageId}`,
        { withCredentials: true }
      );
      if (data.success) {
        getMessages();
      } else {
        console.log("Error: ", data.message);
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  const sendMessage = async (formData) => {
    try {

      const { data } = await axios.post(
        `${backendurl}/api/chat/sendmsg/${selectedChat._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        getMessages();
      } else {
        console.log("Error: ", data.message);
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/chat/getallusers`, {
        withCredentials: true,
      });
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unSeenMessages);
      } else {
        console.log("Error: ", data.message);
      }
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };


  useEffect(() => {
    if (selectedChat) {
      getMessages();
    }
  }, [selectedChat]);

  const values = {
    messages,
    users,
    getUsers,
    selectedChat,
    setSelectedChat,
    unseenMessages,
    markAsRead,
    sendMessage,
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};
