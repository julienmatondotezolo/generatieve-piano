"use strict";

let newKeyData;
let players;


const sampler = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",

    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

// players = new mm.Player()
/* soundFontPlayer();
const music_vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');

async function soundFontPlayer() {
    players = await new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
} */

let notes;
$.getJSON("src/keyNumbers.json", function(json) {
    notes = json;
});

export async function playNotes(keyData, notesArr) {
    //  console.log('PLAYER STATUS: ', players.getPlayState());

    /*     let MIDI;
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
        } */

    //  console.log(newKeyData);
    //  console.log(notes[newKeyData]);
    /*     var audio = new Audio('src/C4v13.wav');
        audio.play();
     */


    Tone.loaded().then(() => {
            sampler.triggerAttackRelease([`${notes[keyData].letter + notes[keyData].number}`], 4);
        })
        /*     let piano = Synth.createInstrument('piano');

            piano.play(notes[keyData].letter, notes[keyData].number, 2);
         */


}







export function playNotes2(keyData, notesArr) {

    Array.prototype.delayedForEach = function(callback, timeout, thisArg) {
        var i = 0,
            l = this.length,
            self = this,
            caller = function() {
                callback.call(thisArg || self, self[i], i, self);
                (++i < l) && setTimeout(caller, timeout);
            };
        caller();
    }; //  https://gist.github.com/fernandosavio/6011834

    let piano = Synth.createInstrument('piano');
    notesArr.delayedForEach(function(key, index, array) {

        //   piano.play(key.letter, key.number, 2);

        Tone.loaded().then(() => {
            sampler.triggerAttackRelease([`${key.letter + key.number}`], 4);
        })
    }, 500);


}

/*
https://tonejs.github.io/
https://tonejs.github.io/docs/14.7.77/Sampler.html
https://www.javascripting.com/view/tone-js
https://www.devbridge.com/articles/tonejs-coding-music-production-guide/
https://stackoverflow.com/questions/55800651/tone-js-additive-synth
https://dev.to/je_we/building-a-simple-piano-with-tone-js-and-nexusui-part-2-4bpp
https://tonejs.github.io/docs/14.7.58/Synth
https://stackoverflow.com/questions/18752925/html5-audio-getting-the-sound-of-piano

http://newt.phys.unsw.edu.au/jw/notes.html
https://devriffs.com/simple-tonejs-keyboard/
https://paino-fp3.herokuapp.com/


https://shannonpeng.com/projects/virtual-piano*/