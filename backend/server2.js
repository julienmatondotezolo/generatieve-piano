/* global require */

"use strict";

/*--------- Variables --------*/
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const fs = require("fs");
const cors = require('cors');
//const tf = require('@tensorflow/tfjs-node'); // Uncomment for heroku && comment for localhost
const path = require('path');
const port = process.env.PORT || 3000;
const mmcore = require('@magenta/music/node/core');
const rnn = require('@magenta/music/node/music_rnn');
const melodyRNN = new rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
const app = express();
const server = require('http').Server(app);
var note = require('midi-note')


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

app.use(bodyParser.urlencoded({
    extended: true,
}));
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
    console.log(req.body);
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

                console.log(sample);
                let object = createNotesObject(sample);
                console.log(object);

                res.send({
                    object,
                    firstEmotion
                });
            });

    }
    await emotionsToNotes();


});

// Create a playable object with the generated  notes of the AI
function createNotesObject(item) {
    let notes = [];
    let notesPitch = [];

    console.log(item);
    item.notes.forEach(element => {
        let pitch;
        let randomNumber = Math.floor(Math.random() * 61) + 40;
        let convertedNote;
        let newString;
        let newNumber;


        if (element.pitch < 101 && element.pitch > 39) {
            convertedNote = note(element.pitch);
            pitch = { pitch: element.pitch };
        } else {
            convertedNote = note(randomNumber);
            pitch = { pitch: randomNumber };

        }

        if (convertedNote.length === 2) {
            newString = convertedNote.slice(0, 1);
            newNumber = convertedNote.slice(1, 2);
        } else {
            newString = convertedNote.slice(0, 2);
            newNumber = convertedNote.slice(2, 3);
        }

        let newObject = {
            'letter': newString,
            'number': newNumber
        };
        notes.push(newObject);
        notesPitch.push(pitch);
    });

    return {
        notes,
        notesPitch
    };

}


// Takes the most common emotion of the user that the front-end sends to us
function extractEmotion(emotionArr) {

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

// Chooses a midi file depending on what extractEmotion() returns
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
// ========== POST: NOTES TO NOTES ==========  //
app.post("/notes-to-midi", async(req, res, next) => {

    let notes = req.body;
    notes.totalTime = notes.notes.length;

    const qns = mmcore.sequences.quantizeNoteSequence(notes, 2); // 2 == steps per quarter
    await melodyRNN.continueSequence(qns, 10, 2) // AI continues the sequence depending the midi file // 15 == notes /-/ 2 == temperature
        .then(sample => {

            let object = createNotesObject(sample);
            res.send(object);

        });



});


for (let index = 40; index <= 100; index++) {
    var str = note(index);
    let string;
    let number;
    if (note(index).length === 2) {
        string = str.slice(0, 1);
        number = str.slice(1, 2);
    } else {
        string = str.slice(0, 2);
        number = str.slice(2, 3);

    }
    console.log(`
             "${index}": {
                 "letter": "${string}",
                 "number": ${number}
             },
         `);

}