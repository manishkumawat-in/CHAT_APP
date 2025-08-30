import express from "express";
import {
  getAllUsers,
  getMessages,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/msgController.js";
import authChecker from "../middleware/authChecker.js";
import upload from "../middleware/imageUpload.js";

const msgRouter = express.Router();

msgRouter.get("/getallusers", authChecker, getAllUsers);
msgRouter.get("/getmsg/:id", authChecker, getMessages);
msgRouter.get("/markasread/:id", authChecker, markMessagesAsRead);
msgRouter.post("/sendmsg/:id", authChecker, upload.single("file"), sendMessage);

export default msgRouter;
  