/*  global $ */
/*/////////////   IMPORTS   ////////////////*/
"use strict";
import {
    playNotes,
    playAINotes
} from './magenta.js';

import {
    sendOnlineNotes
} from './socket.js';
/*/////////////   VARIABLES   ////////////////*/

let clicked = false;
let count = 5;
let keyboardColor;
let keyData;
let checkMode;
let notes = [];
let sendNotesInterval;

let whiteNumber = [36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93, 95];
let blackNumber = [37, 39, 42, 44, 46, 49, 51, 54, 56, 58, 61, 63, 66, 68, 70, 73, 75, 78, 80, 82, 85, 87, 90, 92, 94];

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


$(".key").on('mouseleave', function() {
    clearInterval(window.myTimerOnMove);
});

$(".key").mouseup(function() {
    clicked = false;
    count = 5;
    clearInterval(window.myTimer);
    changeKeyStatus($(this).attr('data-active'), this);
}).mousedown(function() {
    clicked = true;

    checkMode = $(".keyboard").attr('data-mode');
    checkKeyboardMode(checkMode, this);

    keyData = $(this).attr('data-note');
    playNotes(keyData);

    keyboardColor = $('.keyboard').attr('data-color');
    addColorToKey(this, keyboardColor, false);
    changeKeyStatus($(this).attr('data-active'), this);

    createNote($(this), $(this).attr('data-note'));
    window.myTimer = setInterval(addLengthToNotes, 50, $(this).attr('data-note'));
    let counter = 0;

    $('.key').mouseenter(function(e) {
        counter++;
        if (counter <= 1) {
            if ($(".key:hover").length !== 0 && clicked) {
                counter = 0;

                checkKeyboardMode(checkMode, this);

                keyData = $(this).attr('data-note');
                playNotes(keyData);

                keyboardColor = $('.keyboard').attr('data-color');
                addColorToKey(this, keyboardColor, false);

                createNote($(this), $(this).attr('data-note'));
                clearInterval(window.myTimerOnMove);
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

function createNote(element, note, height, color) {
    // sendUserNotes(note); If you uncomment this line, the bot will play with himself when you touch on minimum one piano key.

    keyboardColor = $('.keyboard').attr('data-color');

    if(color) {
        keyboardColor = color
    }

    let newKeyboardColor = keyboardColor ? keyboardColor : '#e6e6e6';


    let width = element.width();
    let positionLeft = element.offset().left;
    let keyHeight = height ? height : 5;

    $('.notes').append(`
        <div class="note-block" data-note="${note}" style="left: ${positionLeft}px; height: ${keyHeight}0px; width: ${width}px; background-color: ${newKeyboardColor} !important"></div>
    `);

    setTimeout(function() {
        $(`.note-block:nth-child(1)`).remove();
    }, 5000);
}

function addLengthToNotes(noteId) {
    $(`.note-block[data-note=${noteId}]:last-child`).css('height', (count++) + '0px');
}

/*/////////////   AUTO PLAY NOTES   ////////////////*/

export async function autoplayNotes(noteSeq, keyboardColor) {
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

    if (noteSeq.notesPitch.length > 0) {
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
        await playAINotes(newKeyData, noteSeq.notes);
    }

}

/*/////////////   CALCULATE NOTES HEIGHT   ////////////////*/

function calculateHeight(startTime, endTime) {
    return endTime - startTime;
}

/*/////////////   SWITCH BETWEEN MODES (BOT, ONLINE, NORMAL)   ////////////////*/

function checkKeyboardMode(mode, element) {
    if (mode === "bot") {
        sendUserNotes($(element).attr('data-note'));
    } else if (mode === "online") {
        keyData = $(element).attr('data-note');
        sendOnlineNotes(keyData);
    } else {
        console.log("No mode active");
    }
}

// Add the notes of the user in an object then push in array
function sendUserNotes(noteNumber) {
    let object = { pitch: parseInt(noteNumber) };
    notes.push(object);
}

/*/////////////   BOT MODES THAT WILL AUTOPLAY USER NOTES   ////////////////*/

export function botMode() {
    console.log("[START] bot mode");
    window.sendNotesInterval = setInterval(sendData, 5000);
}

export function exitBotMode() {
    notes = [];
    clearInterval(window.sendNotesInterval);
    console.log("[EXIT] bot mode");
    // window.location.reload();
}

// Function every 5000ms when BOT MODE is active. Look if they are notes of user in array, if yes => SEND DATA TO BACKEND
function sendData() {
    console.log("senddata");
    if (notes.length > 1 && checkMode === "bot") {
        sendUserNotesToAI(notes).then(data => {
            keyboardColor = $('.keyboard').attr('data-color');
            autoplayNotes(data, keyboardColor);
        }).catch(error => {
            console.log("error", error)
        })
        notes = [];
    } else {
        console.log("Empty notes or bot mode not detected.")
    }
}

// Async function to send data of user input to BACKEND. Response (.then(data)) = AI response (see when function is called)
async function sendUserNotesToAI(notes) {
    const rawResponse = await fetch('https://paino-fp3.herokuapp.com/notes-to-midi', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
    });

    if (rawResponse.status === 200) {
        return await rawResponse.json();
    } else {
        console.log("error getting data!");
    }
}

/*/////////////   ONLINE MODE   ////////////////*/

export function onlineMode(element, key, color) {
    playNotes(key);
    keyboardColor = $('.keyboard').attr('data-color');
    addColorToKey(element, color, true, 1000);
    createNote($(element), key, 5, color);
}


let width = $(window).width();

if( width <= 850 ) {
    console.log("Start mediaqueries");
    $(".settings").clone().appendTo(".info");
    $(".options .settings").hide();
} else {
    $(".info .settings").hide();
    $(".options .settings").show();
}