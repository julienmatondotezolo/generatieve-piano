/*  global $ */
/*/////////////   IMPORTS   ////////////////*/
"use strict";
import {
    playNotes,
    playAINotes
} from './magenta.js';
/*/////////////   VARIABLES   ////////////////*/

let clicked = false;
let count = 5;
let keyboardColor;
let keyData;
let checkMode;

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

    ]
};

/*/////////////   FUNCTION INITIALISATIONS   ////////////////*/
let whiteNumber = [36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93, 95];
let blackNumber = [37, 39, 42, 44, 46, 49, 51, 54, 56, 58, 61, 63, 66, 68, 70, 73, 75, 78, 80, 82, 85, 87, 90, 92, 94];
initWebcam();
initKeyboard();

document.querySelector('button').addEventListener('click', async() => { // Function a supprimer?
    //   console.log('audio is ready');
    /*     $.getJSON("src/response.json", async function(data, textStatus, jqXHR) {
            keyboardColor = $('.keyboard').attr('data-color');
            await autoplayNotes(data, keyboardColor);
        }); 
        
    */
});
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
    keyData = $(this).attr('data-note');
    playNotes(keyData);

    keyboardColor = $('.keyboard').attr('data-color');
    addColorToKey(this, keyboardColor, false);
    changeKeyStatus($(this).attr('data-active'), this);

    createNote($(this), $(this).attr('data-note'));
    window.myTimer = setInterval(addLengthToNotes, 50, $(this).attr('data-note'));
    let counter = 0;

    checkKeyboardMode(checkMode, this);

    $('.key').mouseenter(function(e) {

        counter++;
        if (counter <= 1) {
            if ($(".key:hover").length !== 0 && clicked) {
                console.log("SLIDED");
                counter = 0;
                keyData = $(this).attr('data-note');
                playNotes(keyData);

                keyboardColor = $('.keyboard').attr('data-color');
                addColorToKey(this, keyboardColor, false);

                createNote($(this), $(this).attr('data-note'));
                clearInterval(window.myTimerOnMove);

                checkKeyboardMode(checkMode, this);

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

function addLengthToNotes(noteId) {
    $(`.note-block[data-note=${noteId}]:last-child`).css('height', (count++) + '0px');
}

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

function calculateHeight(startTime, endTime) {
    return endTime - startTime;
}

let myVar;
let notes = [];

// Active or desactive BOT MODE when clicked on the button
export function toggleBotMode() {
    checkMode = $('.keyboard').attr("data-mode");
    notes = [];

    function myStopFunction() {
        clearInterval(myVar);
    }
    if (checkMode === "bot") {
        console.log("Duet mode active");
        myVar = setInterval(sendData, 5000);
    } else {
        console.log("Duet mode not active");
        myStopFunction();
    }

}
// Add the notes of the user in an object then push in array
function sendUserNotes(noteNumber) {
    let object = { pitch: parseInt(noteNumber) };
    notes.push(object);
}

function checkKeyboardMode(mode, element) {
    if (mode === "bot") {
        sendUserNotes($(element).attr('data-note'));
    }
}

// Function every 5000ms when BOT MODE is active. Look if they are notes of user in array, if yes => SEND DATA TO BACKEND
function sendData() {
    if (notes.length > 1 && checkMode === "bot") {
        sendUserNotesToAI(notes).then(data => {
            keyboardColor = $('.keyboard').attr('data-color');
            autoplayNotes(data, keyboardColor);
        });
        notes = [];
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