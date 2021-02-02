"use strict";

const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const http = require("http").Server(app);
const createUsers = require("./routes/create-users");
const sendUsers = require("./routes/send-users");

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

app.use("/create-users", createUsers);
app.use("/send-users", sendUsers);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
