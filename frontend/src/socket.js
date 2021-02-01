/*/////////////   VARIABLES   ////////////////*/

let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
let local_stream;
let peer = null;
let peerId = null;
let socket = io('ws://localhost:8080');
let conn = null;
let peerObj = {};
let joinerPeerObj = {};
let ROOM_ID = getUrlParameter('rooms');

/*/////////////   INITIALISATION   ////////////////*/

randomUserImage();
onlineDuet(ROOM_ID);
initSocket();

/*/////////////   FUNCTION CREATE OR JOIN   ////////////////*/

export function onlineDuet(id) {
    $(this).attr("data-connect", "pending").removeClass("bg-green").text("connecting...").css({color: "#fff", background: "grey"})
    if (id) {
        joinOnlineDuet(id)
    } else if ( $(".online-duet").data('clicked') ){
        createRoom(id)
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
    let video = document.getElementById("video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

/*/////////////   ONLINE USER name & VIDEO STREAM   ////////////////*/

function setRemoteStream(stream) {
    $(".remote-video").show();

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

/*/////////////   CREATE ONLINE DUET   ////////////////*/

function createRoom(){
    console.log("Creating room.")

    peer = new Peer();

    peer.on('open', (id) => {
        let newUrl = document.location.href + "?rooms=" + id;
        window.location = newUrl

        $(".online-duet").attr("data-connect", "pending").removeClass("bg-green").addClass("bg-red").text("joining...").css("color", "#fff")
    })
}

// function createRoom(){
//     console.log("Creating room.")

//     peer = new Peer();
//     socket = io('ws://localhost:8080', {'multiplex': false});

//     peer.on('open', (id) => {
//         peerId = id;
//         peerObj.peer_id = id

//         let newUrl = document.location.href + "?rooms=" + id;
//         window.history.pushState({}, document.title, newUrl)

//         console.log("Room created with ID: ", id)
//         ROOM_ID = id
//         socket.emit('join-room', ROOM_ID, id)

//         getUserMedia({video: true, audio: true}, (stream)=>{
//             local_stream = stream;
//             setLocalStream(local_stream)
//         },(err)=>{
//             console.log(err)
//         })
        
//         $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
//     })
//     peer.on('connection', function(peerConn) {
//         conn = peerConn
//         conn.on('open', function() {
//             // Receive messages
//             conn.on('data', function (data) {
//                 joinerPeerObj = data
//                 setName(data)
//             });
//             // Send messages
//             conn.send(peerObj);
//         })
//     });
//     peer.on('close', function() {
//         console.log("Connection destroyed. Please refresh.")
//     });
//     peer.on('disconnected', function() {
//         console.log("Disconnected.")
//     });
//     peer.on('call',(call) => {
//         call.answer(local_stream);
//         call.on('stream',(stream)=>{
//             setRemoteStream(stream)
//         })
//     });
//     peer.on('error', function (err) {
//         console.log(err);
//         alert('' + err);
//     });

//     $(".icon-devices").click(function (e) { 
//         e.preventDefault();
//         let txt = prompt("Send message", "")
//         socket.emit('message', txt)
//     });
// }

/*/////////////   JOIN ONLINE DUET   ////////////////*/

function joinOnlineDuet(ROOM_ID) {
    if (ROOM_ID) {
        console.log(ROOM_ID)
        peer = new Peer();
        socket = io('ws://localhost:8080');
    
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            setLocalStream(stream)
    
            peer.on('call', call => {
                call.answer(stream)
                call.on('stream', userVideoStream => {
                    setLocalStream(userVideoStream)
                })
            })
    
            socket.on('user-connected', userId => {
                // connectToNewUser(userId, stream)
            })
        });

        $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
    } else {
        console.log("No room found.")
    }
}

// function joinOnlineDuet(ROOM_ID) {
//     if (ROOM_ID) {
//         console.log("Joining room with ID: " + ROOM_ID)

//         peer = new Peer();
//         socket = io('ws://localhost:8080');

//         peer.on('open', (id) => {
//             peerId = id;
//             peerObj.peer_id = id;
//             socket.emit('join-room', ROOM_ID, id)

//             console.log("Connected with ID: " + id);
//             // GET USER MEDIA
//             getUserMedia({
//                 video: true,
//                 audio: true
//             }, (stream) => {
//                 local_stream = stream;
//                 let call = peer.call(ROOM_ID, stream)
//                 setLocalStream(local_stream)
    
//                 call.on('stream', (stream) => {
//                     setRemoteStream(stream);
//                 })
//             }, (err) => {
//                 console.log(err)
//             })

//             conn = peer.connect(ROOM_ID);
//             conn.on('open', function() {
//                 // Receive messages
//                 conn.on('data', function (data) {
//                     setName(data)
//                 });
//                 // Send messages
//                 conn.send(peerObj);
//             })

//             $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
//         })
//         peer.on('close', function () {
//             peer = null;
//             console.log('Connection destroyed. Please refresh');
//         });
        
//         $(".icon-devices").click(function (e) { 
//             e.preventDefault();
//             let txt = prompt("Send message", "")
//             socket.emit('message', txt)
//         });
//     } else {
//         console.log("No rooms found")
//     }
// }

/*/////////////   EXIT ONLINE DUET   ////////////////*/

export function exitOnlineDuet(ROOM_ID) {
    $(`.user-content[data-user=${joinerPeerObj.peer_id}]`).remove()

    peer.disconnect();
    peer.destroy();

    console.log("Left room with ID: " + ROOM_ID)
    $(".remote-video").hide();
    $(".online-duet").attr("data-connect", "false").removeClass("bg-red").addClass("bg-green").text("join online duet").css("color", "")

    let newUrl = document.location.href.split('?')[0];
    window.location = newUrl
}

/*/////////////   INITIALIZE SOCKET   ////////////////*/

function initSocket() {
    socket.on('user-connected', userId => {
        console.log("user-connected: ", userId)
        peer.on('call',(call) => {
            call.answer(local_stream);
            call.on('stream',(stream)=>{
                setRemoteStream(stream)
            })
        });
    })
    
    socket.on('message', text => {
        console.log(text)
    });
    
    socket.on('user-disconnected', userId => {
        console.log("user-disconnected: ", userId)
        // if (peers[userId]) peers[userId].close()
    })
    
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