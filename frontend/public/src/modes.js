/*/////////////   IMPORT FUNCTIONS   ////////////////*/

import {
    onlineDuet,
    exitOnlineDuet,
} from './socket.js';

import {
    botMode,
    exitBotMode,
} from './keyboard.js';

import {
    exitNormalMode,
    loadNormalMode,
} from '../webcam/face-recognition.js';

/*/////////////   VARIABLES   ////////////////*/

let roomId = getUrlParameter('rooms');
let bool = false;
let botObj = {}

botObj.peer_id = "bot2id",
botObj.username = "Paino BOT"
botObj.src = "images/bot.png",

/*/////////////   CLICK FUNCTIONS   ////////////////*/

$('.ai-bot').click(function(e) {
    e.preventDefault();
    toggleModes(".ai-bot", ".online-duet")
    setName(botObj)
});

$(".online-duet").click(function(e) {
    e.preventDefault();
    toggleModes(".online-duet", ".ai-bot")
    $(`.user-content[data-user=${botObj.peer_id}]`).remove()
});

/*/////////////   TOGGLE BETWEEN MODES   ////////////////*/

function setName(data) {
    if (data.username) {
        $('.room').append(`
            <article class="user-content" data-user="${data.peer_id}">
                <img class="random-logo" src="${data.src}" alt=""">
                <p class="user">${data.username}</p>
            </article>
        `);

        $('.local-video .emotion-txt').text(peerObj.username)
        $(".remote-video .emotion-txt").text(data.username)

        $(`.user-content:last-child .user`).css("color", "#bd23fe")
        $('.user-content:last-child .random-logo').css("background", "#bd23fe")
    }
}

/*/////////////   TOGGLE BETWEEN MODES   ////////////////*/

function toggleModes(mode1, mode2) {
    if (mode1 == ".online-duet") {
        $(mode1).data('clicked', true).removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
        $(mode2).data('clicked', false).prop('disabled', true).css("background", "#7e7e7e");

        let checkStatus = $(mode1).attr("data-connect");
        bool = !bool;
        if (checkStatus === "false") {
            // $('.keyboard').attr("data-mode", "online").attr('data-color', 'blue');
            onlineDuet(roomId);
            exitNormalMode();
        } else if (checkStatus === "true") {
            $('.keyboard').attr("data-mode", bool);
            exitOnlineDuet(roomId);
            $(mode2).data('clicked', false).prop('disabled', false).removeAttr('style');
        }
    } else if (mode1 == ".ai-bot") {
        $(mode1).data('clicked', true).addClass("bg-red").text("exit bot mode").css("color", "#fff")
        $(mode2).data('clicked', false).removeClass("bg-green").attr("data-bot", bool).prop('disabled', true).css("background", "#7e7e7e");
        bool = !bool;
        if (bool) {
            $('.keyboard').attr("data-mode", "bot");
            botMode();
            exitNormalMode();
        } else {
            $('.keyboard').attr("data-mode", bool);
            $(mode1).attr("data-bot", bool).removeClass("bg-red").text("duet with A.I bot").removeAttr('style');
            $(mode2).data('clicked', false).addClass("bg-green").prop('disabled', false).removeAttr('style');
            $(".user-content:last-child").remove()
            exitBotMode();
            loadNormalMode();
        }
    } else {
        console.error("Error: ", "wrong mode.");
    }
}

// Get url parameter
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};