/*/////////////   JOIN ONLINE DUET   ////////////////*/

let lastPeerId = null;
let peer = null; // own peer object
let conn = null;
let peerObj = {};
let roomId = getUrlParameter('rooms');
let url = "";
let call = null;

checkRoomStatus();
randomUserImage();

$(".online-duet").click(function (e) {
    e.preventDefault();

    let checkStatus = $(this).attr("data-connect");

    if (checkStatus === "false") {
        let username = prompt("Please enter your name", "Enter your name");

        if (username !== "" || username !== "Enter your name") {
            peerObj.username = username
            initPeerConn()
            $(this).attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
        } else {
            alert("Enter a valid name !")
        }

    } else {
        peer.destroy()
        $(this).attr("data-connect", "false").removeClass("bg-red").addClass("bg-green").text("join online duet").css("color", "")
    }
});

$(".ai-bot").click(function (e) {
    peer = new Peer();
    let roomId = prompt("Please enter your name", "Enter room number");

    conn = peer.connect(roomId);

    if(conn) {
        console.log("connected to peer id: " + roomId)
        conn.send('Hello!');
        console.log("Message send !")
        $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
    }
})

function checkRoomStatus() {
    if (roomId) {
        if (roomId !== peerObj.userId) {
            initPeerConn();
            conn = peer.connect(roomId);
            peer.on('connection', function (conn) {
                console.log(conn)
            });
            console.log("Connecting to room with ID: ", roomId);
        } else {
            console.log("Room ID equals User ID")
        }
    } else {
        console.log("No room detected.")
    }
}

function initPeerConn() {
    peer = new Peer();
    peer.on('open', function (id) {
        peerObj.userId = id

        let newUrl = document.location.href + "?rooms=" + id;
        window.history.pushState({}, null, newUrl)

        console.log('My peer ID is: ' + id);
        $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
    });

    peer.on('connection', function (conn) {
        console.log("Connection: ", conn)
    });

    peer.on('call', function(call) {
        // Answer the call, providing our mediaStream
        call.answer(mediaStream);
    });

    peer.on('close', function () {
        conn = null;
        let url = document.location.href.split('?')[0]
        window.history.pushState({}, null, url)
        console.log('Connection destroyed. Please refresh');
    });
}

/*/////////////   RANDOM USER IMAGE   ////////////////*/

function randomUserImage() {
    let randomNumber = Math.floor(Math.random() * 25) + 1;
    let randomDegrees = Math.floor(Math.random() * 360);

    $(".random-logo").attr("src", `images/icons/${randomNumber}.png`);
    // $(".random-logo").css("filter", `hue-rotate(${randomDegrees}deg) saturate(2)`);
    $(".random-logo").css("filter", `hue-rotate(${randomDegrees}deg)`);
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