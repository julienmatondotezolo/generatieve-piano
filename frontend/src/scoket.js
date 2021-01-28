/*/////////////   JOIN ONLINE DUET   ////////////////*/

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
let peer = null;
let peerObj = {};
let roomId = getUrlParameter('rooms');
let url = "";

randomUserImage();

$(".online-duet").click(function (e) {
    e.preventDefault();

    let checkStatus = $(this).attr("data-connect");

    if (checkStatus === "false") {
        joinOnlineDuet(roomId)
        $(this).attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
    } else {
        console.log("Leaving room...")
        exitOnlineDuet()
        $(this).attr("data-connect", "false").removeClass("bg-red").addClass("bg-green").text("join online duet").css("color", "")
    }
});

/*/////////////   LOCAL USER VIDEO STREAM   ////////////////*/

function setLocalStream(stream) {
    let video = document.getElementById("video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

/*/////////////   ONLINE USER VIDEO STREAM   ////////////////*/

function setRemoteStream(stream) {
    $(".remote-video").show();

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

/*/////////////   JOIN ONLINE DUET   ////////////////*/

function joinOnlineDuet(roomId) {
    console.log("Joining room with id: " + roomId)

    peer = new Peer()
    let conn = peer.connect(roomId);

    peer.on('open', (id) => {
        peerObj.userId = id
        console.log("Connected with Id: " + id)
        //video
        getUserMedia({
            video: true,
            audio: true
        }, (stream) => {
            local_stream = stream;
            let call = peer.call(roomId, stream)
            setLocalStream(local_stream)

            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })
        }, (err) => {
            console.log(err)
        })

        conn.on('data', function (data) {
            console.log('Received', data);
        });

        // Send messages
        conn.send(peerObj);
    })
}

function exitOnlineDuet(roomId) {
    peer.destroy()
    console.log("Left room with id: " + roomId)
    $(".remote-video").hide();
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