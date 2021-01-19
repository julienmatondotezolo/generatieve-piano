/*--------- Variables --------*/
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const port = 3001;
const app = express();
http.Server(app);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })