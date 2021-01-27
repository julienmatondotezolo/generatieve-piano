/* global require */

"use strict";

/*--------- Variables --------*/
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const fs = require("fs");
const cors = require('cors');
// const tf = require('@tensorflow/tfjs-node'); // Uncomment for heroku && comment for localhost
const path = require('path');
const port = process.env.PORT || 3000;
const mmcore = require('@magenta/music/node/core');
const rnn = require('@magenta/music/node/music_rnn');
const melodyRNN = new rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
const app = express();
const server = require('http').Server(app);

melodyRNN.initialize();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());
app.use(cors());



app.listen(port, () => {
    console.log(`
            Example app listening at http://localhost:${port}`);
});




app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname + '/index.html'));

});


/*TODO:: CHANGE MIDI FILES TO HAVE 20 SEC FILES INSTEAD OF 2000 HOURs;*/


// ========== POST EMOTIONS TO NOTES ==========  //
app.post("/emotion-to-notes", async(req, res, next) => {

    let emotionArr = req.body;
    let firstEmotion = extractEmotion(emotionArr);
    let midiFile = chooseMidiFile(firstEmotion);

    async function emotionsToNotes() {

        let midiBuffer;
        midiBuffer = fs.readFileSync(midiFile);
        const notes = mmcore.midiToSequenceProto(midiBuffer); // Transforms a midi file to an array of notes
        const qns = mmcore.sequences.quantizeNoteSequence(notes, 2); // 2 == steps per quarter
        melodyRNN.continueSequence(qns, 15, 2) // AI continues the sequence depending the midi file // 15 == notes /-/ 2 == temperature
            .then(sample => {

                let object = createNotesObject(sample);

                res.send({ object, firstEmotion });
            });

    }
    await emotionsToNotes();


});

function createNotesObject(item) { // Create a playable object with the generated  notes of the AI

    let notes = [];

    item.notes.forEach(element => {
        let newObject = {
            pitch: element.pitch,
            startTime: element.quantizedEndStep * 0.3,
            endTime: element.quantizedEndStep * 0.3 + 0.3,
        };
        notes.push(newObject);
    });

    let filteredNotes = notes.filter((element) => element.pitch < 124 && element.pitch > 7); // filter the notes that are unplayable


    return filteredNotes;

}


function extractEmotion(emotionArr) { // Takes the most common emotion of the user that the front-end sends to us

    let counter = 0;
    let counterTwo = 1;
    let firstEmotion;
    for (let i = 0; i < emotionArr.length; i++) {

        for (let j = i; j < emotionArr.length; j++) {
            if (emotionArr[i].emotion === emotionArr[j].emotion)
                counter++;

            if (counterTwo < counter) {
                counterTwo = counter;
                firstEmotion = emotionArr[i].emotion;
            }

        }
        counter = 0;

    }

    return firstEmotion;
}

function chooseMidiFile(firstEmotion) { // Chooses a midi file depending on what extractEmotion() returns

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
// ========== POST: NOTES TO NOTES ==========  //
app.post("/notes-to-midi", async(req, res, next) => {

    let notes = req.body;
    notes.totalTime = notes.notes.length;

    console.log(notes);




    const qns = mmcore.sequences.quantizeNoteSequence(notes, 2); // 2 == steps per quarter
    melodyRNN.continueSequence(qns, 15, 2) // AI continues the sequence depending the midi file // 15 == notes /-/ 2 == temperature
        .then(sample => {

            let object = createNotesObject(sample);

            res.send(object);

        });



});