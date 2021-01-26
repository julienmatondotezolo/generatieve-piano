/*--------- Variables --------*/
/* global require */

"use strict";


const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const fs = require("fs");
const cors = require('cors');
var path = require('path');
const port = process.env.PORT || 3000;
const mmcore = require('@magenta/music/node/core');
const rnn = require('@magenta/music/node/music_rnn');
const melodyRNN = new rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn'); // Makes a melody from the input

melodyRNN.initialize();
const app = express();
http.Server(app);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(cors());



app.listen(port, () => {
    console.log(`
            Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname + '/index.html'));


});

// ========== POST MIDI TO NOTES ==========  //
app.post("/emotion-to-notes", async(req, res, next) => {

    let emotionArr = req.body;
    let firstEmotion = await extractEmotion(emotionArr);
    let midiFile = chooseMidiFile(firstEmotion);

    console.log(midiFile);
    async function emotionsToNotes(emotion) {
        let midiBuffer;

        console.log(emotion);
        //  if (emotion) {
        midiBuffer = fs.readFileSync(midiFile);
        // }
        const notes = mmcore.midiToSequenceProto(midiBuffer);
        const qns = mmcore.sequences.quantizeNoteSequence(notes, 2); // 2 == steps per quarter
        melodyRNN.continueSequence(qns, 15, 6) // 15=notes // 6== temperature
            .then(sample => {
                console.log("yello");
                let newArray = [];

                sample.notes.forEach(element => {
                    let newObject = {
                        pitch: element.pitch,
                        startTime: element.quantizedEndStep * 0.3,
                        endTime: element.quantizedEndStep * 0.3 + 0.3,
                    };
                    newArray.push(newObject);
                });

                res.send({
                    newArray,
                    firstEmotion

                });
            });

    }
    await emotionsToNotes(firstEmotion);


});


async function extractEmotion(emotionArr) {
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

    return firstEmotion;
}

function chooseMidiFile(firstEmotion) {

    let x = Math.floor(Math.random() * 5) + 1;
    let midiFile;
    switch (firstEmotion) {
        case "happy":
            midiFile = 'midi/happy/' + x + '.mid';
            break;
        case "angry":
            midiFile = 'midi/angry/' + x + '.mid';
            break;
        case "sad":
            midiFile = 'midi/sad/' + x + '.mid';
            break;
        case "surprised":
            midiFile = 'midi/surprised/' + x + '.mid';
            break;
        case "neutral":
            midiFile = 'midi/neutral/' + x + '.mid';
            break;
        case "fearful":
            midiFile = 'midi/fearful/' + x + '.mid';
            break;
        case "disgusted":
            midiFile = 'midi/disgusted/' + x + '.mid';
            break;
        default:
            midiFile = 'midi/neutral/' + x + '.mid';

    }

    return midiFile;
}