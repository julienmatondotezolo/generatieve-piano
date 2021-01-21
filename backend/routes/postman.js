const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

module.exports = router;
