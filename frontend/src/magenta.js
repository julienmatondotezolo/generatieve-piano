"use strict";

let notes;
$.getJSON("src/keyNumbers.json", function(json) {
    notes = json;
});

const sampler = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",

    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();


export async function playNotes(keyData) {

    Tone.loaded().then(() => {
        sampler.triggerAttackRelease([`${notes[keyData].letter + notes[keyData].number}`], 1);
    });

}

export function playAINotes(keyData, notesArr) {

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

    notesArr.delayedForEach(function(key, index, array) {
        Tone.loaded().then(() => {
            sampler.triggerAttackRelease([`${key.letter + key.number}`], 3);
        });
    }, 250);


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

https://shannonpeng.com/projects/virtual-piano
*/