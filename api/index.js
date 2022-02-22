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

app.listen(3000, () => {
  console.log("Backend server is running! port:3000");
});
