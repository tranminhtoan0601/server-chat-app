const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const converstationRoute = require("./routes/converstation");
const messageRoute = require("./routes/message");
const router = express.Router();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/converstation", converstationRoute);
app.use("/message", messageRoute);

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push(userId, socketId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUsers = (userId) => {
  return users.find((user) => {
    user.userId === userId;
  });
};
io.on("connection", (socket) => {
  //when connect
  console.log("a user connected ");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUsers(receiverId);
    io.to(user.socketId).emit("getMessage", { senderId, text });
  });
  //when disconnect
  socket.on("disonnect", () => {
    console.log("a user disconnect");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(3000, () => {
  console.log("Backend server is running! port:3000");
});
