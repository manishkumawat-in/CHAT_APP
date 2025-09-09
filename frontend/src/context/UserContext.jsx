import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export const UserContext = createContext();

const backendurl = import.meta.env.VITE_BACKEND_URL;

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState();
  const [socket, setSocket] = useState();
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/getuser`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (state, info) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/${state}`,
        info,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setUserData(data.userData);
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendurl}/api/user/logout`, null, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(null);
        toast.success("Logout successful");
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/updateprofile`,
        updatedData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setUserData(data.userData);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const updateImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const { data } = await axios.post(
        `${backendurl}/api/user/updateimage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setUserData(data.userData);
        toast.success("Profile image updated successfully");
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // useEffect(() => {
  //   connectSocket();
  // }, [userData]);

  const value = {
    userData,
    onlineUsers,
    setOnlineUsers,
    login,
    logout,
    updateProfile,
    updateImage,
    socket,
    setSocket,
    // connectSocket,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
