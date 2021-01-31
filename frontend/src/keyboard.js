/*  global $ */
/*/////////////   IMPORTS   ////////////////*/
"use strict";

import {
    playNotes,
    playNotes2
} from './magenta.js';

/*/////////////   VARIABLES   ////////////////*/

let clicked = false;
let count = 5;
let keyboardColor;
let keyData;
let checkMode;
let notes = [];
window.keyBoardTIMER;

let notesArrObj = [{
    emotion: "sad",
    level: 0.6376954913139343
}, {

    emotion: "happy",
    level: 0.6376954913139343
}, {
    emotion: "angry",
    level: 0.6376954913139343
}, {
    emotion: "angry",
    level: 0.997367799282074
}, {
    emotion: "angry",
    level: 0.6776954913139343
}, {
    emotion: "angry",
    level: 0.8976954913139343
}, {
    emotion: "surprised",
    level: 1
}, {
    emotion: "sad",
    level: 0.9978705644607544
}, {
    emotion: "happy",
    level: 0.5648226141929626
}];

let noteSeqData = {
    notes: [{
            pitch: 60,
            startTime: 0.0,
            endTime: 0.5
        },
        {
            pitch: 60,
            startTime: 0.5,
            endTime: 1.0
        },
        {
            pitch: 67,
            startTime: 1.0,
            endTime: 1.5
        },
        {
            pitch: 67,
            startTime: 1.5,
            endTime: 2.0
        },
        {
            pitch: 69,
            startTime: 2.0,
            endTime: 2.5
        },
        {
            pitch: 69,
            startTime: 2.5,
            endTime: 3.0
        },
        {
            pitch: 67,
            startTime: 3.0,
            endTime: 4.0
        },
        {
            pitch: 65,
            startTime: 4.0,
            endTime: 4.5
        },
        {
            pitch: 65,
            startTime: 4.5,
            endTime: 5.0
        },
        {
            pitch: 64,
            startTime: 5.0,
            endTime: 5.5
        },
        {
            pitch: 64,
            startTime: 5.5,
            endTime: 6.0
        },
        {
            pitch: 62,
            startTime: 6.0,
            endTime: 6.5
        },
        {
            pitch: 62,
            startTime: 6.5,
            endTime: 7.0
        },
        {
            pitch: 60,
            startTime: 7.0,
            endTime: 8.0
        },
    ]
};

let whiteNumber = [40, 42, 44, 45, 47, 49, 51, 52, 54, 56, 57, 59, 61, 63, 64, 66, 68, 69, 71, 73, 75, 76, 78, 80, 81, 83, 85, 87, 88, 90, 92, 93, 95, 97, 99];
let blackNumber = [41, 43, 46, 48, 50, 53, 55, 58, 60, 62, 65, 67, 70, 72, 74, 77, 79, 82, 84, 86, 89, 91, 94, 96, 98];

/*/////////////   FUNCTION INITIALISATIONS   ////////////////*/

initWebcam();
initKeyboard();

/*/////////////   CLICK FUNCTIONS ON KEY   ////////////////*/

$(".key").hover(function() {
    // over
    keyboardColor = $('.keyboard').attr('data-color');
    addColorToKey(this, keyboardColor);
}, function() {
    // out
    // $(this).css('background-color', '')
});

$(".key").mouseup(function() {
    clicked = false;
    count = 5;
    clearInterval(window.myTimer);
    changeKeyStatus($(this).attr('data-active'), this);
}).mousedown(function() {
    clicked = true;
    checkMode = $('.keyboard').attr("data-mode");
    checkKeyBoardMode(checkMode);
    keyData = $(this).attr('data-note');
    playNotes(keyData);

    keyboardColor = $('.keyboard').attr('data-color');
    addColorToKey(this, keyboardColor, false);
    changeKeyStatus($(this).attr('data-active'), this);

    createNote($(this), $(this).attr('data-note'));
    // console.log($(this).attr('data-note'));
    window.myTimer = setInterval(addLengthToNotes, 50, $(this).attr('data-note'));
    let counter = 0;
    $('.key').mouseenter(function(e) {

        if (counter <= 1) {


            if ($(".key:hover").length !== 0 && clicked) {
                console.log("SLIDED");

                counter = 0;
                keyData = $(this).attr('data-note');
                playNotes(keyData);

                keyboardColor = $('.keyboard').attr('data-color');
                addColorToKey(this, keyboardColor, false)

                createNote($(this), $(this).attr('data-note'))
                clearInterval(window.myTimerOnMove);
            } else {

            }
        }
    });
    $('.key').mouseleave(function() {
        count = 5;
        clearInterval(window.myTimerOnMove);
    });


});

/*/////////////   INITIALIZE WEBCAM   ////////////////*/

function initWebcam() {
    $.get("webcam/webcam.html", function(content) {
        // console.log( 'Webcam DATA HTML', content )
        $('main').append(content);
    });
    console.log('Webcam is loaded.');
}

/*/////////////   INITIALIZE KEYBOARD   ////////////////*/


function initKeyboard() {
    generateKeyboard();
}

/*/////////////   GENERATE KEYBOARD   ////////////////*/

function generateKeyboard() {
    $('.white-keys').empty();
    $('.black-keys').empty();

    let keyLength = 35; // Number of visible keys
    let steps = 40; // 
    let stepsBlack = 37;
    let stepsBlackByTen = 0;



    for (let i = 0; i < keyLength; i++) {
        generateKey(i, keyLength);
    }

    for (let i = 0; i < 5; i++) {
        generateBlackKey(i, stepsBlackByTen);
    }

    addNotesToKeys();

    let keyboard = " * Keyboard loaded * ";
    console.log("%c" + keyboard, "background: #f0047f; color: #fff");
}

/*/////////////   GENERATE KEYS   ////////////////*/

function generateKey(keyNote, keyLength) {

    $('.white-keys').append(`
         <div class="key white-key unselectable" data-note="${whiteNumber[keyNote]}" data-active="false">
            <p>${whiteNumber[keyNote]}</p>
        </div>
    `);

    $('.white-key').css({
        width: keyWidth(keyLength) + "%"
    });
}

function generateBlackKey(keyNote, bigSteps) {
    $('.black-keys').append(`
        <span class="cluster clus2" style="width: ${keyWidth(22)}%;">
            <div class="key black-key unselectable" data-active="false">
                <p>${bigSteps}</p>
            </div>
            <div class="key black-key unselectable" data-active="false">
                <p>${bigSteps}</p>
            </div>
        </span>
        <span class="cluster clus3" style="width: ${keyWidth(13)}%;">
            <div class="key black-key unselectable" data-active="false">
                <p>${bigSteps}</p>
            </div>
            <div class="key black-key unselectable" data-active="false">
                <p>${bigSteps}</p>
            </div>
            <div class="key black-key unselectable"data-active="false">
                <p>${bigSteps}</p>
            </div>
        </span>
    `);

    $('.clus2 > .black-key').css({
        width: keyWidth(3) + '%',
        marginRight: keyWidth(3) + '%',
    });
    $('.clus3 > .black-key').css({
        width: keyWidth(5.075) + '%',
        marginRight: keyWidth(5.075) + '%',
    });
    // $('.cluster').slice(10).remove();
}

function addNotesToKeys() {
    let stepsBlack = 0;

    $('.black-key').each(function(i, e) {
        $(this).attr('data-note', blackNumber[stepsBlack]);
        $(this).children('p').text(blackNumber[stepsBlack]);
        stepsBlack += 1;
    });

}

function changeKeyStatus(keyStatus, element) {
    if (keyStatus === 'false') {
        keyStatus = $(element).attr('data-active', 'true');
    } else {
        keyStatus = $(element).attr('data-active', 'false');
    }
}

/*/////////////   GET KEY NUMBER   ////////////////*/

function getKeyNumber(key) {
    let keyNumber;
    let getKeyNote = key.attr('data-note');

    if (getKeyNote.indexOf('w') > -1) {
        keyNumber = getKeyNote.replace('w', ' ');
    }

    if (getKeyNote.indexOf('b') > -1) {
        keyNumber = getKeyNote.replace('b', ' ');
    }

    return keyNumber;
}

/*/////////////   RESPONSIVE KEY WITDH   ////////////////*/

function keyWidth(keysLength) {
    let keyboardLength = $('.keys').width();
    let keyWidth = (100 / keysLength);
    return keyWidth;
}

/*/////////////   CLICKED KEY FUNCTIONS   ////////////////*/

function addColorToKey(element, color, autoplay, endTime) {
    let keyboardColor = color ? color : '#e6e6e6';
    $(element).css('background', `linear-gradient(180deg, ${keyboardColor} 0%, ${keyboardColor} 100%)`);

    if (autoplay) {
        setTimeout(function() {
            $(element).css('background', '');
        }, endTime);
    } else {
        $(element).mouseout(function() {
            setTimeout(function() {
                $(element).css('background', '');
            }, 100);
        });
    }
}

/*/////////////   GENERATE NOTES   ////////////////*/

function createNote(element, note, height) {

    // sendUserNotes(note); If you uncomment this line, the bot will play with himself when you touch on minimum one piano key.

    keyboardColor = $('.keyboard').attr('data-color');
    let width = element.width();
    let positionLeft = element.offset().left;
    let keyHeight = height ? height : 5;

    $('.notes').append(`
        <div class="note-block" data-note="${note}" style="left: ${positionLeft}px; height: ${keyHeight}0px; width: ${width}px; background-color: ${keyboardColor} !important"></div>
    `);

    setTimeout(function() {
        $(`.note-block:nth-child(1)`).remove();
    }, 5000);
}

/*/////////////   ADD LENGTH TO NOTES   ////////////////*/

function addLengthToNotes(noteId) {
    $(`.note-block[data-note=${noteId}]:last-child`).css('height', (count++) + '0px');
}

/*/////////////   FUNCTION TO AUTO PLAY NOTES  ////////////////*/

async function autoplayNotes(noteSeq, keyboardColor) {
    let height;
    let newKeyData;
    let counter = 0;
    let newKeyboardColor = keyboardColor ? keyboardColor : '#e6e6e6';

    Array.prototype.delayedForEach = function(callback, timeout, thisArg) {
        var i = 0,
            l = this.length,
            self = this,
            caller = function() {
                callback.call(thisArg || self, self[i], i, self);
                (++i < l) && setTimeout(caller, timeout);
            };
        caller();
    };

    noteSeq.notesPitch.delayedForEach(function(notes, index, array) {

        counter++;
        let matchKey = $(".keyboard").find(`.key[data-note='${notes.pitch}']`);

        keyData = matchKey.attr('data-note');

        newKeyData = keyData ? matchKey.attr('data-note') : 'w75';
        let element = keyData ? $(`.key[data-note='${notes.pitch}']`) : $(".key[data-note='75']");
        addColorToKey(matchKey, newKeyboardColor, true, 500);
        height = calculateHeight(counter * 10, counter * 10);
        createNote(element, keyData, height);


    }, 500);

    await playNotes2(newKeyData, noteSeq.notes);

}

/*/////////////   CALCULATE HEUGHT   ////////////////*/

function calculateHeight(startTime, endTime) {
    return endTime - startTime;
}

/*/////////////   CHECK KEYBOARD MODE   ////////////////*/

function checkKeyBoardMode(checkMode) {
    if (checkMode === "true") {
        console.log("Duet mode active");
        $(".key").mousedown(function() {
            sendUserNotes($(this).attr('data-note'));
        });

        window.keyBoardTIMER = setInterval(() => {
            if (notes.length > 1) {
                sendUserNotesToAI(notes).then(data => {
                    console.log(data);
                    keyboardColor = $('.keyboard').attr('data-color');
                    autoplayNotes(data, keyboardColor);
                });
                notes = [];
            }
        }, 5000);
    } else {
        clearInterval(window.keyBoardTIMER)
        console.log("Duet mode not active");
        // BOT IS NOT ACTIVE;
    }
}

/*/////////////   CLICK FUNCTIONS ON KEY   ////////////////*/

function sendUserNotes(noteNumber) {
    let object = {
        pitch: parseInt(noteNumber)

    };
    notes.push(object);
}

/*/////////////   SEND NOTES TO BACKEND   ////////////////*/

async function sendUserNotesToAI(notes) {
    const rawResponse = await fetch('https://paino-fp3.herokuapp.com/notes-to-midi', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            notes
        })
    });

    if (rawResponse.status === 200) {
        return await rawResponse.json();
    } else {
        console.log("error getting data!");
    }

}