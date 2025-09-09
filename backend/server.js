import express from "express";
import http from "http";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";

import connectdb from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import msgRouter from "./routes/msgRoutes.js";

const app = express();
const server = http.createServer(app);
connectdb();
app.use(cors({
  origin: "https://buddy-llgk.onrender.com",
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());


export const io = new Server(server, {
  cors: {
    origin: "https://buddy-llgk.onrender.com",
    methods: ["GET", "POST"],
  },
});

export const onlineUsers = {};
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("disconnect", ()=> {
    console.log("disconnected from socket.io", userId);

    delete onlineUsers[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));    
  })
}); 

app.use("/api/user", userRouter);
app.use("/api/chat", msgRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

const port = process.env.PORT || 2000;

server.listen(port, console.log(`server is listening on port: ${port}`));
