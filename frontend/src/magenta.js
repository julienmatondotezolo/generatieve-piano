"use strict";

let players = new mm.Player();
let newKeyData;

export function playNotes(keyData) {

    let TWINKLE = {

        notes: [{
            pitch: 50,
            startTime: 0.0,
            endTime: 0.1
        }],
    };

    if (keyData.indexOf('w') > -1) {
        newKeyData = keyData.replace('w', '');
        TWINKLE.notes[0].pitch = 50 + parseInt(newKeyData);
    } else {
        newKeyData = keyData.replace('b', '');
        TWINKLE.notes[0].pitch = 70 + parseInt(newKeyData);
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