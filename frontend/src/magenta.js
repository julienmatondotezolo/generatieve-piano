"use strict";

let players = new mm.Player();
players = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
let newKeyData;

export async function playNotes(keyData) {

    let pitchLevel = 30;

    let TWINKLE = {
        notes: [{
            pitch: pitchLevel,
            startTime: 0.0,
            endTime: 0.1
        }]
    };

    if (keyData.indexOf('w') > -1) {
        newKeyData = keyData.replace('w', '');
        TWINKLE.notes[0].pitch = pitchLevel + parseInt(newKeyData);
    } else {
        newKeyData = keyData.replace('b', '');
        TWINKLE.notes[0].pitch = pitchLevel + 20 + parseInt(newKeyData);
        keyData.replace('b', '');
    }

    if (players) {
        players.stop(TWINKLE);
    } else {
        players.resume()
    }

    players.start(TWINKLE);
}

/* function holdNote() {
    TWINKLE.notes[0].endTime += 0.1;
    //console.log(TWINKLE.notes[0].endTime += 1);
}

function resetNote() {
    TWINKLE.notes[0].endTime = 0.1;
} */