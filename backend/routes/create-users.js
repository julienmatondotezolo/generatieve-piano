const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/", async (req, res) => {

 let usersObj = JSON.parse(fs.readFileSync("routes/users.json").toString());
  console.log(usersObj);

  let addNewUser = async (newUser) => {
    usersObj.users = [...usersObj.users, newUser];
  };
  console.log(req.body);
  
    addNewUser(req.body.userId);

  console.log(usersObj);
     fs.writeFile("routes/users.json", JSON.stringify(usersObj), (err, result) => {
    if (err) console.log("error", err);
  });  

 
});

module.exports = router;
