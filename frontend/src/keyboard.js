/*/////////////   IMPORTS   ////////////////*/

import {
    playNotes
} from './magenta.js';

/*/////////////   VARIABLES   ////////////////*/

let clicked = false;
let count = 5;
let keyboardColor;
let keyData;

let notesArrObj = [
    {
        emotion: "sad",
        level: 0.6376954913139343
    }, {
        emotion: "sad",
        level: 0.6376954913139343
    }, {
        emotion: "sad",
        level: 0.6376954913139343
    }, {
        emotion: "sad",
        level: 0.997367799282074
    }, {
        emotion: "happy",
        level: 0.6776954913139343
    }, {
        emotion: "sad",
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
    }
]

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
    // $.getJSON("src/midi-backend.json", async function (data, textStatus, jqXHR) {
    //     keyboardColor = $('.keyboard').attr('data-color');
    //     await autoplayNotes(data, keyboardColor);
    // });
    await sendEmotion(notesArrObj)
    // console.log(noteSeqData)
    // await autoplayNotes(noteSeqData, '');
})

async function sendEmotion(emotionArr) {
    changeBtn('loading...')
    const rawResponse = await fetch('https://paino-fp3.herokuapp.com/emotion-to-notes', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emotionArr)
    }).then((result) => {
        console.log(result.json())
    }).catch((err) => {
        changeBtn('error')
        console.log(err.body)
    });

    console.log(await rawResponse)
    const dataPitchNotes = await rawResponse.json();
    keyboardColor = $('.keyboard').attr('data-color');
    await autoplayNotes(dataPitchNotes, keyboardColor);
    changeBtn('This website using sound.')
}

function changeBtn(text) {
    $('button').text(text)
}

/*/////////////   CLICK FUNCTIONS ON KEY   ////////////////*/

$(".key").hover(function () {
    // over
    keyboardColor = $('.keyboard').attr('data-color');
    keyboardColor = keyboardColor ? keyboardColor : '#e6e6e6'
    $(this).css('background-color', keyboardColor)
}, function () {
    // out
    $(this).css('background-color', '')
});

$(".key").mouseup(function () {
    clicked = false;
    count = 5;
    clearInterval(window.myTimer);
    changeKeyStatus($(this).attr('data-active'), this)
    console.log('Mouse: ', '')
}).mousedown(function () {
    clicked = true;
    keyData = $(this).attr('data-note');
    // playNotes(keyData);

    keyboardColor = $('.keyboard').attr('data-color');
    addColorToKey(this, keyboardColor, false)
    changeKeyStatus($(this).attr('data-active'), this)
    
    createNote($(this), $(this).attr('data-note'))
    window.myTimer = setInterval(addLengthToNotes, 50, $(this).attr('data-note'))
    console.log('Mouse: ', 'clicked')

    $('.key').mouseenter(function (e) {
        if ($(".key:hover").length != 0 && clicked) {

            keyData = $(this).attr('data-note');
            // playNotes(keyData);

            keyboardColor = $('.keyboard').attr('data-color');
            addColorToKey(this, keyboardColor, false)

            createNote($(this), $(this).attr('data-note'))
        
            console.log('Mouse: ', 'clicked + moving in element')
        } else {
            console.log('Mouse: ', 'Not clicked')
        }
    })

    $('.key').mouseleave(function () {
        count = 5;
        clearInterval(window.myTimerOnMove);
        console.log('Mouse: ', 'clicked + moving out')
    })

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
    $('.white-keys').empty();
    $('.black-keys').empty();

    let keyLength = 35
    let steps = 46;
    let stepsBlack = 37;
    let stepsBlackByTen = 0;

    for (let i = 0; i < keyLength; i++) {
        steps += 2
        generateKey(i, keyLength, steps)
    }

    for (let i = 0; i < 5; i++) {
        stepsBlack += 2
        stepsBlackByTen += 10
        generateBlackKey(i, stepsBlackByTen, stepsBlack)
    }

    addNotesToKeys()

    let keyboard = " * Keyboard loaded * "
    console.log("%c" + keyboard, "background: #f0047f; color: #fff")
}

/*/////////////   GENERATE KEYS   ////////////////*/

function generateKey(keyNote, keyLength, steps) {
    $('.white-keys').append(`
         <div class="key white-key unselectable" data-note="w${steps}" data-active="false">
            <p>${steps}</p>
        </div>
    `);

    $('.white-key').css({
        width: keyWidth(keyLength) + "%"
    });
}

function generateBlackKey(keyNote, bigSteps, steps) {
    $('.black-keys').append(`
        <span class="cluster clus2" style="width: ${keyWidth(22)}%;">
            <div class="key black-key unselectable" data-note="b${keyNote}" data-active="false">
                <p>${bigSteps}</p>
            </div>
            <div class="key black-key unselectable" data-note="b${keyNote}" data-active="false">
                <p>${bigSteps}</p>
            </div>
        </span>
        <span class="cluster clus3" style="width: ${keyWidth(13)}%;">
            <div class="key black-key unselectable" data-note="b${keyNote}" data-active="false">
                <p>${bigSteps}</p>
            </div>
            <div class="key black-key unselectable" data-note="b${keyNote}" data-active="false">
                <p>${bigSteps}</p>
            </div>
            <div class="key black-key unselectable" data-note="b${keyNote}" data-active="false">
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
    let whiteKeys = $('.white-key')
    let steps = 46;
    let stepsBlack = 47;

    for (let i = 1; i < whiteKeys.length + 1; i++) {
        steps += 2
        $(`.white-key:nth-child(${i}) p`).text(steps)
    }

    $('.black-key').each(function(i, e) {
        stepsBlack += 2
        $(this).attr('data-note', stepsBlack)
        $(this).children('p').text(stepsBlack)
    });

    // $('.key').each(function(i, e) {
    //     steps += 1
    //     $(this).attr('data-note', steps)
    //     $(this).children('p').text(steps)
    // });
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
    let keyboardLength = $('.keys').width();
    let keyWidth = (100 / keysLength)
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

function createNote(element, note, height) {
    keyboardColor = $('.keyboard').attr('data-color');
    let width = element.width()
    let positionLeft = element.offset().left
    let keyHeight = height ? height : 5;

    $('.notes').append(`
        <div class="note-block" data-note="${note}" style="left: ${positionLeft}px; height: ${keyHeight}0px; width: ${width}px; background-color: ${keyboardColor} !important"></div>
    `);

    setTimeout(function () {
        $(`.note-block:nth-child(1)`).remove();
    }, 5000);
}

function addLengthToNotes(noteId) {
    $(`.note-block[data-note=${noteId}]:last-child`).css('height', (count++) + '0px');
}

async function autoplayNotes(noteSeq, keyboardColor) {

    let notesArr = []
    let height;
    let newKeyData;

    for (const notes of await noteSeq.notes) {
        let matchKey = $(".keyboard").find(`.key[data-note='w${notes.pitch}']`)
        keyData = matchKey.attr('data-note');

        newKeyData = keyData ? matchKey.attr('data-note') : 'w75';
        let matchKeyPosition = keyData ? matchKey.position().left : 75;
        
        notesArr.push(notes)

        setTimeout(() => {
            addColorToKey(matchKey, keyboardColor, true, notes.startTime + 1000)
            height = calculateHeight(notes.startTime * 10, notes.endTime * 10)
            createNote(matchKey.width(), matchKeyPosition, height)
        }, notes.startTime * 1000);
    }

    await playNotes(newKeyData, notesArr);

}