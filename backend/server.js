"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
//const port = normalizePort(process.env.PORT || "3000");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const postman = require("./routes/postman");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  socket.on("sendEmotion", (msg) => {
    console.log("message: " + msg);
  });
});

app.use("/postman", postman);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
