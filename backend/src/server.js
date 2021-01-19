/*--------- Variables --------*/
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const port = 3001;
const app = express();
http.Server(app);

const MPPClient = require('multiplayerpianojs')
const mpp = new MPPClient()

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/connect", (req, res) => {
    mpp.connect()

    mpp.on('connected', () => {
        console.log('bot connected')
        mpp.setName('Mr Roboto')
        mpp.setChannel('my room')
            .then(() => console.log('Channel Set!'))
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})