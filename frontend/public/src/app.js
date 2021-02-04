import * as hello from './hello.js';
import * as keyboard from './keyboard.js';
import * as modes from './modes.js';
import * as magenta from './magenta.js';
import * as socket from './socket.js';

let width = $(window).width();
if (width <= 850) {
    console.log("Start mediaqueries");
    $(".settings").clone().appendTo(".info");
    $(".options .settings").hide();
} else {
    $(".info .settings").hide();
    $(".options .settings").show();
}