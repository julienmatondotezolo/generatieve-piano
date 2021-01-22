"use strict";

let players = new mm.Player();
let newKeyData;

export async function playNotes(keyData, notesArr) {
    players = await new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
    
    let MIDI;
    let pitchLevel = 30;

    if (notesArr) {
        MIDI = {
            notes: notesArr
        };    
    } else {
        MIDI = {
            notes: [{
                pitch: pitchLevel,
                startTime: 0.0,
                endTime: 0.1
            }]
        };
    }

    if (keyData.indexOf('w') > -1) {
        newKeyData = keyData.replace('w', '');
        MIDI.notes[0].pitch = parseInt(newKeyData);
    } else {
        newKeyData = keyData.replace('b', '');
        MIDI.notes[0].pitch = parseInt(newKeyData) - 20;
    }

    if (players) {
        players.stop(MIDI);
        console.log('player: ', 'stopped')
    } else {
        players.resume()
        console.log('player: ', 'resume')
    }

    players.start(MIDI);
}

/* function holdNote() {
    MIDI.notes[0].endTime += 0.1;
    //console.log(MIDI.notes[0].endTime += 1);
}

function resetNote() {
    MIDI.notes[0].endTime = 0.1;
} */