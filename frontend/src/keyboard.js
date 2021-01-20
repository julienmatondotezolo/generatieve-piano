initWebcam()
initKeyboard()

/*/////////////   VARIABLES   ////////////////*/

let sec = 0;
let clicked = false;

/*/////////////   CLICK FUNCTIONS ON KEY   ////////////////*/

$(".key").mouseup(function () {
    clicked = false;
    sec = 0;
    clearInterval(window.myTimer);
    changeKeyStatus($(this).attr('data-active'), this)
}).mousedown(function () {
    clicked = true;
    addColorToKey(this)
    changeKeyStatus($(this).attr('data-active'), this)
    window.myTimer = setInterval(createNote, 25, $(this).width(), $(this).position().left);

    $('.key').mouseenter(function (e) {
        // console.log('clicked', $(".key:hover").length != 0 && clicked)
        if ($(".key:hover").length != 0 && clicked) {
            addColorToKey(this)
            // window.myTimerOnMove = setInterval(createNote, 25, $(this).width(), $(this).position().left);
            createNote($(this).width(), $(this).position().left)
        }
    }).mouseleave(function () {
        // clearInterval(window.myTimerOnMove);
    })
});

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

    let keyLength = 30

    for (let i = 0; i < keyLength; i++) {
        let note = i;
        generateKey(note, keyWidth(keyLength))
    }

    $(".key[data-note=b2]").remove();
    $(".key[data-note=b3]").remove();
    $(".key[data-note=b4]").remove();
    $(".key[data-note=b8]").remove();
    $(".key[data-note=b9]").remove();
    $(".key[data-note=b13]").remove();
    $(".key[data-note=b14]").remove();
    $(".key[data-note=b17]").remove();
    $(".key[data-note=b20]").remove();
    $(".key[data-note=b24]").remove();
    for (let i = 25; i < 30; i++) {
        $(`.key[data-note=b${i}]`).remove();
    }
    let keyboard = " * Keyboard loaded * "
    console.log("%c" + keyboard, "background: #f0047f;; color: #fff")
}

/*/////////////   GENERATE KEYS   ////////////////*/

function generateKey(keyNote, keyLength) {
    $('.keyboard').append(`

        <div class="key white unselectable" data-note="w${keyNote}" data-active="false">
            <p>W${keyNote}</p>
        </div>

        <div class="key black unselectable" data-note="b${keyNote}" data-active="false" style="left: ${1 + keyNote * 4}%">
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

/*/////////////   RESPONSIVE KEY WITDH   ////////////////*/

function keyWidth(keysLength) {
    let keyboardLength = $('.keyboard').width();
    let keyWidth = 100 / keysLength
    return keyWidth
}

/*/////////////   CLICKED KEY FUNCTIONS   ////////////////*/

function addColorToKey(element) {
    $(element).addClass("colorBg");
    $(element).mouseout(function () {
        setTimeout(function () {
            $(element).removeClass("colorBg");
        }, 1000);
    });
}

/*/////////////   GENERATE NOTES   ////////////////*/

function createNote(width, positionLeft) {
    // $('.notes').append(`
    //     <div class="note-block colorBg" style="left: ${positionLeft}px; height: ${++sec}0px; width: ${width}px"></div>
    // `);

    $('.notes').append(`
        <div class="note-block colorBg" style="left: ${positionLeft}px; height: ${5}0px; width: ${width}px"></div>
    `);

    setTimeout(function () {
        $(`.note-block:nth-child(1)`).remove();
    }, 5000);
}