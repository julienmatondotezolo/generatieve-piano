/*--------- Variables --------*/
"use strict"

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const fs = require("fs");
const mvae = require('@magenta/music/node/music_vae');
const mmcore = require('@magenta/music/node/core');

const app = express();
http.Server(app);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.sendStatus(200).send(200);
});

// ========== POST MIDI TO NOTES ==========  //
app.post("/emotion-to-notes", async(req, res, next) => {

    let emotion = req.body;
    if (emotion.hasOwnProperty("emotion")) {
        let notes = emotionsToNotes(req.body);
        res.send(notes);
    } else {
        console.log('No emotions found');
        res.send('No emotions found');
    }

});



function emotionsToNotes(emotion) {
    let midiBuffer;
    if (emotion) {
        midiBuffer = fs.readFileSync('midi/pirate.mid');
    }
    const notes = mmcore.midiToSequenceProto(midiBuffer);
    console.log("Notes: ", notes);
    return notes;
}


app.listen(3000);