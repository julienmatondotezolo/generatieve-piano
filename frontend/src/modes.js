/*/////////////   IMPORT FUNCTIONS   ////////////////*/
"use strict";
import {
    onlineDuet,
    exitOnlineDuet,
} from './socket.js';

import {
    botMode,
    exitBotMode,
} from './keyboard.js';


/*/////////////   VARIABLES   ////////////////*/

let roomId = getUrlParameter('rooms');
let keyboardMode = getUrlParameter('keyboard');
let bool = false;

/*/////////////   CLICK FUNCTIONS   ////////////////*/

$('.ai-bot').click(function(e) {
    e.preventDefault();
    toggleModes(".ai-bot", ".online-duet")
});

$(".online-duet").click(function(e) {
    e.preventDefault();
    toggleModes(".online-duet", ".ai-bot")
});

/*/////////////   CHECK KEYBOARD MODE   ////////////////*/

if (keyboardMode) {
    $('.keyboard').attr("data-mode", keyboardMode);
}

/*/////////////   TOGGLE BETWEEN MODES   ////////////////*/

function toggleModes(mode1, mode2) {
    if (mode1 == ".online-duet") {
        $(mode1).data('clicked', true).removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
        $(mode2).data('clicked', false).prop('disabled', true).css("background", "#7e7e7e");

        let checkStatus = $(mode1).attr("data-connect");
        bool = !bool;
        if (checkStatus === "false") {
            $('.keyboard').attr("data-mode", "online");
            onlineDuet(roomId);
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
        } else {
            $('.keyboard').attr("data-mode", bool);
            $(mode1).attr("data-bot", bool).removeClass("bg-red").text("duet with A.I bot").removeAttr('style');
            $(mode2).data('clicked', false).addClass("bg-green").prop('disabled', false).removeAttr('style');
            exitBotMode();
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