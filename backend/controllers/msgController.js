import UserModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import { io, onlineUsers } from "../server.js";
import MsgModel from "../models/msgModel.js";

// geting all the users except the logged in user
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );

    const unSeenMessages = {};

    users.map(async (user) => {
      
      const messages = await MsgModel.find({
        recieverId: req.userId,
        senderId: user._id,
        read: false,
      });

      if (messages.length > 0) {
        unSeenMessages[user._id] = messages.length;
      }
    });

    return res.json({ success: true, users, unSeenMessages });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// getting messages for selected user
export const getMessages = async (req, res) => {
  const selectedUserId  = req.params.id;
  console.log(req.userId);
  
  try {
    const messages = await MsgModel.find({
      $or: [
        { senderId: req.userId, recieverId: selectedUserId },
        { senderId: selectedUserId, recieverId: req.userId },
      ],
    }).sort({ createdAt: 1 });
    return res.json({ success: true, messages });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// making messages as read
export const markMessagesAsRead = async (req, res) => {
  const selectedUserId = req.params.id;
  try {
    const messages = await MsgModel.updateMany(
      { senderId: selectedUserId, recieverId: req.userId, read: false },
      { $set: { read: true } }
    );
    return res.json({ success: true, messages });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//sending message

export const sendMessage = async (req, res) => {
  const { text } = req.body;

  const recieverId = req.params.id;

  try {
    
    let imageURl;
    if (req.file) {
        const uploadData = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat_app/chat_files",
        });
        imageURl = uploadData.secure_url;
    }
    
    const newMessage = await MsgModel.create({ 
      senderId: req.userId,
      recieverId,
      text: text || "",
      image: imageURl,
    });

    const recieverSocketId = onlineUsers[recieverId];
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage); 
    }

    return res.json({ success: true, message: newMessage });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}