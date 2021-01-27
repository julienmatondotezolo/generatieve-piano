"use strict";

let newKeyData;
let players;

// players = new mm.Player()
soundFontPlayer()
const music_vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');

async function soundFontPlayer() {
    players = await new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus')
}

export async function playNotes(keyData, notesArr) {
    console.log('PLAYER STATUS: ', players.getPlayState())

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

    if (players.isPlaying()) {
        players.stop();
    }

    players.start(MIDI)

}

/* function holdNote() {
    MIDI.notes[0].endTime += 0.1;
    //console.log(MIDI.notes[0].endTime += 1);
}

function resetNote() {
    MIDI.notes[0].endTime = 0.1;
} */