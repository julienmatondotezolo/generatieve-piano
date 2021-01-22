/*/////////////   IMPORTS   ////////////////*/

import {
    playNotes
} from './magenta.js';

/*/////////////   VARIABLES   ////////////////*/

let clicked = false;
let sec = 0;
let keyboardColor;
let keyData;

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

/*/////////////   FUNCTION INITIALISATIONS   ////////////////*/

initWebcam()
initKeyboard()

document.querySelector('button').addEventListener('click', async () => {
    console.log('audio is ready')
    $.getJSON("src/response.json", async function (data, textStatus, jqXHR) {
        keyboardColor = $('.keyboard').attr('data-color');
        await autoplayNotes(data, keyboardColor);
    });

    // console.log(noteSeqData)
    // await autoplayNotes(noteSeqData, '');
})

/*/////////////   CLICK FUNCTIONS ON KEY   ////////////////*/

$(".key").mouseup(function () {
    clicked = false;
    sec = 0;
    clearInterval(window.myTimer);
    changeKeyStatus($(this).attr('data-active'), this)
}).mousedown(function () {
    clicked = true;

    keyData = $(this).attr('data-note');
    playNotes(keyData);

    keyboardColor = $('.keyboard').attr('data-color');
    addColorToKey(this, keyboardColor, false)
    changeKeyStatus($(this).attr('data-active'), this)
    // window.myTimer = setInterval(createNote, 25, $(this).width(), $(this).position().left)
    createNote($(this).width(), $(this).position().left)

    $('.key').mouseenter(function (e) {
        if ($(".key:hover").length != 0 && clicked) {

            keyData = $(this).attr('data-note');
            playNotes(keyData);

            keyboardColor = $('.keyboard').attr('data-color');
            addColorToKey(this, keyboardColor, false)
            createNote($(this).width(), $(this).position().left)
        }
    }).mouseleave(function () {
        // clearInterval(window.myTimerOnMove);
    })
});

$(".key").hover(function () {
    // over
    keyboardColor = $('.keyboard').attr('data-color');
    $(this).css('background-color', keyboardColor)
}, function () {
    // out
    $(this).css('background-color', '')
});

/*/////////////   INITIALIZE WEBCAM   ////////////////*/

function initWebcam() {
    $.get("webcam/webcam.html", function (content) {
        // console.log( 'Webcam DATA HTML', content )
        $('main').append(content);
    });
    console.log('Webcam is loaded.')
}

/*/////////////   INITIALIZE KEYBOARD   ////////////////*/

function initKeyboard() {
    generateKeyboard()
}

/*/////////////   GENERATE KEYBOARD   ////////////////*/

function generateKeyboard() {
    $('.keyboard').empty();

    let keyLength = 80

    for (let i = 50; i < keyLength; i++) {
        let note = i;
        generateKey(note, keyWidth(30), i)
    }

    // $(".key[data-note=b2]").remove();
    // $(".key[data-note=b3]").remove();
    // $(".key[data-note=b4]").remove();
    // $(".key[data-note=b8]").remove();
    // $(".key[data-note=b9]").remove();
    // $(".key[data-note=b13]").remove();
    // $(".key[data-note=b14]").remove();
    // $(".key[data-note=b17]").remove();
    // $(".key[data-note=b20]").remove();
    // $(".key[data-note=b24]").remove();
    // for (let i = 65; i < 70; i++) {
    //     $(`.key[data-note=b${i}]`).remove();
    // }
    let keyboard = " * Keyboard loaded * "
    console.log("%c" + keyboard, "background: #f0047f; color: #fff")
}

/*/////////////   GENERATE KEYS   ////////////////*/

function generateKey(keyNote, keyLength, iteration) {
    $('.keyboard').append(`

        <div class="key white unselectable" data-note="w${keyNote}" data-active="false">
            <p>W${keyNote}</p>
        </div>

        <div class="key black unselectable" data-note="b${keyNote}" data-active="false" style="margin-left: ${iteration + 20 * 3}px">
            <p>B${keyNote}</p>
         </div>
    `);
    $('.key').css({
        width: keyLength + '%'
    });
}

function changeKeyStatus(keyStatus, element) {
    if (keyStatus == 'false') {
        keyStatus = $(element).attr('data-active', 'true')
    } else {
        keyStatus = $(element).attr('data-active', 'false')
    }
}

function getKeyNumber(key) {
    let keyNumber;
    let getKeyNote = key.attr('data-note');

    if (getKeyNote.indexOf('w') > -1) {
        keyNumber = getKeyNote.replace('w', ' ')
    }

    if (getKeyNote.indexOf('b') > -1) {
        keyNumber = getKeyNote.replace('b', ' ')
    }

    return keyNumber
}

/*/////////////   RESPONSIVE KEY WITDH   ////////////////*/

function keyWidth(keysLength) {
    let keyboardLength = $('.keyboard').width();
    let keyWidth = 100 / keysLength
    return keyWidth
}

/*/////////////   CLICKED KEY FUNCTIONS   ////////////////*/

function addColorToKey(element, color, autoplay, endTime) {
    $(element).css('background-color', color)

    if (autoplay) {
        setTimeout(function () {
            $(element).css('background-color', '')
        }, endTime);
    } else {
        $(element).mouseout(function () {
            setTimeout(function () {
                $(element).css('background-color', '')
            }, 1000);
        });
    }

}

/*/////////////   GENERATE NOTES   ////////////////*/

function createNote(width, positionLeft, height) {
    keyboardColor = $('.keyboard').attr('data-color');
    let keyHeight;

    if (height) {
        keyHeight = height;
    } else {
        keyHeight = 5;
    }

    $('.notes').append(`
        <div class="note-block" style="left: ${positionLeft}px; height: ${keyHeight}0px; width: ${width}px; background-color: ${keyboardColor} !important"></div>
    `);

    setTimeout(function () {
        $(`.note-block:nth-child(1)`).remove();
    }, 5000);
}

function calculateHeight(start, end) {
    let height = end - start;
    return height;
}

async function autoplayNotes(noteSeq, keyboardColor) {

    let notesArr = []
    let height;

    for (const notes of await noteSeq.notes) {
        let matchKey = $(".keyboard").find(`.key[data-note='w${notes.pitch}']`)
        keyData = matchKey.attr('data-note');

        notesArr.push(notes)

        setTimeout(() => {
            addColorToKey(matchKey, keyboardColor, true, notes.startTime + 1000)
            height = calculateHeight(notes.startTime * 10, notes.endTime * 10)
            createNote(matchKey.width(), matchKey.position().left, height)
        }, notes.startTime * 1000);
    }

    await playNotes(keyData, notesArr);

}