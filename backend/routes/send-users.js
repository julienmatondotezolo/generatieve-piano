const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", async (req, res) => {
  console.log("hey");
  let usersObj = JSON.parse(fs.readFileSync("routes/users.json").toString());
  
 // console.log(usersObj);
 res.send(usersObj);
});

module.exports = router;
