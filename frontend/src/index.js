"use strict";

let clicked = false;
let players = new mm.Player();
let noteSeq = [];
let counter = 0;
let newKeyData;

$(".key").click(function () {
    let keyData = $(this).attr('data-note');
    playNotes(keyData);
});

$(".key").mouseup(function () {
    clicked = false;

}).mousedown(function () {
    clicked = true;
    let keyData = $(this).attr('data-note');
    playNotes(keyData);

    $('.key').mouseenter(function (e) {
        if ($(".key:hover").length !== 0 && clicked) {
            let keyData = $(this).attr('data-note');
            playNotes(keyData);
            // holdNote();
        }
    }).mouseleave(function () {
        // resetNote();
    });

});

function playNotes(keyData) {

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

    if (counter >= 1) {
        players.stop(TWINKLE);
    }

    counter++;

    players.start(TWINKLE);
}

/* function holdNote() {
    TWINKLE.notes[0].endTime += 0.1;
    //console.log(TWINKLE.notes[0].endTime += 1);
}

function resetNote() {
    TWINKLE.notes[0].endTime = 0.1;
} */