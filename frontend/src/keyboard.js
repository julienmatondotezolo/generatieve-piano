console.log('Keyboard loaded')

initKeyboard()

/*/////////////    CLICK FUNCTIONS ON KEY   ////////////////*/

$(".key").mouseup(function () {
    console.log('OFF')
    changeKeyStatus($(this).attr('data-active'), this)
}).mousedown(function () {
    console.log('ON')

    addColorToKey(this)
    changeKeyStatus($(this).attr('data-active'), this)
    generateNotes(this, $(this).position().left, $(this).width())
});

/*/////////////    INITIALIZE KEYBOARD   ////////////////*/

function initKeyboard() {
    generateKeyboard()
}

/*/////////////    GENERATE KEYBOARD   ////////////////*/

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
}

/*/////////////    GENERATE KEYS   ////////////////*/

function generateKey(keyNote, keyLength) {
    $('.keyboard').append(`

        <div class="key white" data-note="w${keyNote}" data-active="false">
            <p>W${keyNote}</p>
        </div>

        <div class="key black" data-note="b${keyNote}" data-active="false" style="left: ${1 + keyNote * 4}%">
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

/*/////////////    RESPONSIVE KEY WITDH   ////////////////*/

function keyWidth(keysLength) {
    let keyboardLength = $('.keyboard').width();
    let keyWidth = 100 / keysLength
    return keyWidth
}

/*/////////////    CLICKED KEY FUNCTIONS   ////////////////*/

function addColorToKey(element) {
    $(element).addClass("colorBg");
    $(element).mouseout(function () {
        setTimeout(function () {
            $(element).removeClass("colorBg");
        }, 1000);
    });
}

/*/////////////    GENERATE NOTES   ////////////////*/

function generateNotes(element, positionLeft, width) {
    $('.notes').append(`
        <div class="note-block colorBg" data-note="${ $(element).attr('data-note')} " style="left: ${positionLeft}px; width: ${width}px;"></div>
    `);

    // If key active add heigth
    // if ($(element).attr('data-active') == 'true') {
    //     addHeightToNote(true, element, positionLeft, width)
    // } else {
    //     addHeightToNote(false, element, positionLeft, width)
    // }

    // remove notes
    setTimeout(function () {
        $(`.note-block:nth-child(1)`).remove();
    }, 5000);
}

function addHeightToNote(status, noteElement, positionLeft, width) {
    let sec = 10;
    let timer = setInterval(myTimer, 1000);

    if (status = true) {
        timer
    } else {
        clearInterval(timer)
    }

    function myTimer() {
        $(`.note-block:nth-child(1)`).remove();
        $('.notes').append(`<div class="note-block colorBg" data-note="${ $(noteElement).attr('data-note')} " style="left: ${positionLeft}px; width: ${width}px; height: ${ ++sec*10 }px"></div>`);
    }

}