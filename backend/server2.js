/*--------- Variables --------*/
/* global require */

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const fs = require("fs");
var path = require('path');
const port = process.env.PORT || 3000;
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

    let emotionArr = req.body;


    /* for (const objects of emotionArr) {

         let objectLength = Object.(objects).length;
         console.log(objectLength);

     }*/

    let mf = 1;
    let m = 0;
    let firstEmotion;
    for (let i = 0; i < emotionArr.length; i++) {

        for (let j = i; j < emotionArr.length; j++) {
            if (emotionArr[i].emotion === emotionArr[j].emotion)
                m++;

            if (mf < m) {
                mf = m;
                firstEmotion = emotionArr[i].emotion;
            }

        }
        m = 0;

    }
    console.log(firstEmotion + " ( " + mf + " times ) ");


    //   if (emotionArr.hasOwnProperty("emotion")) {
    let notes = emotionsToNotes(firstEmotion);
    res.send(notes);
    // } else {
    //   console.log('No emotions found');
    //   res.send('No emotions found');
    //}

});


app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname + '/index.html'));


});



function emotionsToNotes(emotion) {
    let midiBuffer;
    console.log(emotion);
    if (emotion) {
        midiBuffer = fs.readFileSync('midi/pirate.mid');
    }
    const notes = mmcore.midiToSequenceProto(midiBuffer);
    //  console.log("Notes: ", notes);
    console.log(notes);
    return notes;
}


app.listen(port, () => {
    console.log(`
            Example app listening at http://localhost:${port}`);
});