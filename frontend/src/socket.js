/*/////////////   IMPORTS   ////////////////*/

import {
    onlineMode
} from './keyboard.js';

import {
    exitNormalMode,
} from '../webcam/face-recognition.js';

/*/////////////   VARIABLES   ////////////////*/

let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
let peer = null;
let peerId = null;
let socket;
let conn = null;
let note = null;
let peerObj = {};
let ROOM_ID = getUrlParameter('rooms');
let keyboardMode = getUrlParameter('keyboard');

/*/////////////   INITIALISATION   ////////////////*/

randomUserImage();
onlineDuet(ROOM_ID);

/*/////////////   FUNCTION CREATE OR JOIN   ////////////////*/

export function onlineDuet(id) {
    $(this).attr("data-connect", "pending").removeClass("bg-green").text("connecting...").css({color: "#fff", background: "grey"})
    if (id) {
        joinOnlineDuet(id)
    } else if ( $(".online-duet").data('clicked') ){
        createRoom(id)
        exitNormalMode();
    }
}

/*/////////////   LOCAL USER name & VIDEO STREAM   ////////////////*/

function setName(data) {
    if (data.username) {
        $('.room').append(`
            <article class="user-content" data-user="${data.peer_id}">
                <img class="random-logo" src="${data.src}" alt=""">
                <p class="user">${data.username}</p>
            </article>
        `);
    }
}

function setLocalStream(stream) {
    $('.circle-video').css( "border-color", "#42ddf2")

    let video = document.getElementById("video");
    video.srcObject = stream;
    video.muted = false;
    video.play();
}

/*/////////////   ONLINE USER name & VIDEO STREAM   ////////////////*/

function setRemoteStream(stream) {
    $(".remote-video").show();

    $('.circle-remote-video').css( "border-color", "#bd23fe")
    $(`.user-content:last-child .user`).css("color", "#bd23fe")

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.muted = false;
    video.play();
}

/*/////////////   CREATE ONLINE DUET   ////////////////*/

function createRoom(){
    console.log("Creating room.")

    peer = new Peer();

    peer.on('open', (id) => {
        let newUrl = document.location.href + "?rooms=" + id + "&keyboard=online";
        window.location = newUrl

        $(".online-duet").attr("data-connect", "pending").removeClass("bg-green").addClass("bg-red").text("joining...").css("color", "#fff")
    })
}

/*/////////////   JOIN ONLINE DUET   ////////////////*/

function joinOnlineDuet(ROOM_ID) {
    if (keyboardMode) {
        $('.keyboard').attr("data-mode", keyboardMode);
    }
    if (ROOM_ID) {
        peer = new Peer();
        // socket = io('ws://localhost:8080', { 
        //     transports: [ "websocket" ],
        //     withCredentials: true,
        // });
        socket = io('https://paino-socket.herokuapp.com/', { 
            transports: [ "websocket" ],
            withCredentials: true,
        });

        getUserMedia({video: true, audio: true}, (stream)=>{
            setLocalStream(stream)

            peer.on('call', call => {
                call.answer(stream)
                call.on('stream', userVideoStream => {
                    userVideoStream.getAudioTracks()[0].enabled = true;
                    setRemoteStream(userVideoStream)
                })
            })

            socket.on('user-connected', userObj => {
                setName(userObj)
                connectToNewUser(userObj, stream)
                changeSiteColor("#42ddf2")
                console.log(userObj.username + " connected.")
            })
        },(err)=>{
            console.log(err)
        })

        getOnlineNotes()

        socket.on('user-disconnected', userObj => {
            leaveRoom(userObj)
            console.log(`${userObj.username} disconnected.`)
        })
    
        peer.on('open', id => {
            peerObj.peer_id = id;
            socket.emit('join-room', ROOM_ID, peerObj)
        })

        peer.on('connection', function(peerConn) {
            console.log("user connected")
            conn = peerConn
            conn.on('open', function() {
                // Receive messages
                conn.on('data', function (data) {
                    joinerPeerObj = data
                    setName(data)
                });
                // Send messages
                conn.send(peerObj);
            })
        });
    
        $(".icon-devices").click(function (e) { 
            e.preventDefault();
            let txt = prompt("Send message", "")
            peerObj.txt = txt
            socket.emit('message', peerObj)
        });

        $(".ai-bot").data('clicked', false).removeClass("bg-green").attr("data-bot", false).prop('disabled', true).css("background", "#7e7e7e");
        $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
    } else {
        console.log("No room found.")
    }
}

/*/////////////  CONNECT TO NEW USER   ////////////////*/

function connectToNewUser(userObj, stream) {
    const call = peer.call(userObj.peer_id, stream)
    setLocalStream(stream)

    // const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        userVideoStream.getAudioTracks()[0].enabled = true;
        setRemoteStream(userVideoStream)
    })
    call.on('close', () => {
      console.log("Video closed.")
    })
}

/*/////////////   EXIT ONLINE DUET   ////////////////*/

function leaveRoom(userData) {
    $(".remote-video").hide();
    $(`.user-content[data-user=${userData.peer_id}]`).remove()
}

export function exitOnlineDuet(ROOM_ID) {
    $(`.user-content[data-user=${peerObj.peer_id}]`).remove()

    peer.disconnect();
    peer.destroy();

    console.log("Left room with ID: " + ROOM_ID)
    $(".remote-video").hide();
    $(".online-duet").attr("data-connect", "false").removeClass("bg-red").addClass("bg-green").text("join online duet").css("color", "")

    let newUrl = document.location.href.split('?')[0];
    window.location = newUrl
}

/*/////////////   EXPORT SOCKETS   ////////////////*/

function getOnlineNotes() {
    socket.on('piano-key', pianoData => {
        console.log(pianoData);
        onlineMode(`.key[data-note=${pianoData}]`, pianoData)
    });

    socket.on('room-error', roomError => {
        console.log(roomError);
    });
}

export function sendOnlineNotes(pianoKey) {
    if (pianoKey) {
        socket.emit('piano-key', pianoKey);
    }
}

/*/////////////   RANDOM USER   ////////////////*/

function randomUserImage() {
    let randomNumber = Math.floor(Math.random() * 25) + 1;
    let randomDegrees = Math.floor(Math.random() * 360);
    let generateUsername = "Julien" + randomUserNumber()

    $(".random-logo").attr("src", `images/icons/${randomNumber}.png`);
    // $(".random-logo").css("filter", `hue-rotate(${randomDegrees}deg) saturate(2)`);
    peerObj.src = `images/icons/${randomNumber}.png`
    peerObj.username = generateUsername
    $('.user').text(generateUsername)
}

function randomUserNumber() {
    let randomNumber = Math.floor(Math.random() * 25) + 1;
    let randomDegrees = Math.floor(Math.random() * 360);

    return randomDegrees
}

/*/////////////   SAVE USER   ////////////////*/

function saveUserData(data) {
    localStorage.setItem("paino_user_data", JSON.stringify(data));
    let user_data = localStorage.getItem("paino_user_data");
    return user_data
}

function changeSiteColor(color) {
    $('body').css({
        'background': `linear-gradient(180deg, rgba(25,25,25,1) 25%, rgba(51,51,51,1) 75%, ${color} 100%)`
    });
    $('.keyboard').attr('data-color', color);
    $(`.user-content .user`).css("color", color)
    $('.circle-video').css({
        borderColor: color
    })
    $('.keyboard').css({
        borderColor: color,
        borderImage: 'none'
    });
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