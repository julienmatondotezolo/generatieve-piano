/*/////////////   PARAMETERS   ////////////////*/

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
let peer = null;
let conn = null;
let peerObj = {};
let joinerPeerObj = {};
let roomId = getUrlParameter('rooms');
let url = "";
let bool = false;

randomUserImage();
onlineDuet(roomId);

/*/////////////   CLICK FUNCTION TO CHANGE MODE   ////////////////*/

$('.ai-bot').click(function (e) { 
    e.preventDefault();
    bool = !bool;
    
    if(bool) {
        $('.keyboard').attr("data-mode", bool);
        $(this).attr("data-connect", "pending").text("exit bot mode").css({color: "#fff", background: "grey"})
    } else {
        $('.keyboard').attr("data-mode", bool);
        $(this).attr("data-mode", bool).text("duet with A.I bot").css({color: "", background: ""});
    }   
    console.log(bool)
});

/*/////////////   CLICK FUNCTION TO JOIN   ////////////////*/

$(".online-duet").click(function (e) {
    e.preventDefault();

    $(this).data('clicked', true);
    let checkStatus = $(this).attr("data-connect");

    if (checkStatus === "false") {
        $(this).attr("data-connect", "pending").removeClass("bg-green").text("connecting...").css({color: "#fff", background: "grey"})
        onlineDuet(roomId);
    } else if (checkStatus === "true") {
        console.log("Leaving room...")
        exitOnlineDuet(roomId)
    }
});

/*/////////////   FUNCTION CREATE OR JOIN   ////////////////*/

function onlineDuet(id) {
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
            <article class="user-content" data-user="${data.userId}">
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

    peer = new Peer()

    peer.on('open', (id) => {
        peerObj.userId = id
        let newUrl = document.location.href + "?rooms=" + id;
        window.history.pushState({}, document.title, newUrl)

        console.log("Room created with ID: ", id)
        roomId = id

        getUserMedia({video: true, audio: true}, (stream)=>{
            local_stream = stream;
            setLocalStream(local_stream)
        },(err)=>{
            console.log(err)
        })
        
        $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
    })
    peer.on('connection', function(peerConn) {
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
    peer.on('close', function() {
        console.log("Connection destroyed. Please refresh.")
    });
    peer.on('disconnected', function() {
        console.log("Disconnected.")
    });
    peer.on('call',(call) => {
        call.answer(local_stream);
        call.on('stream',(stream)=>{
            setRemoteStream(stream)
        })
    })
    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
}

/*/////////////   JOIN ONLINE DUET   ////////////////*/

function joinOnlineDuet(roomId) {
    if (roomId) {
        console.log("Joining room with ID: " + roomId)

        peer = new Peer()
    
        peer.on('open', (id) => {
            peerObj.userId = id
            console.log("Connected with ID: " + id)
            // GET USER MEDIA
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

            conn = peer.connect(roomId);
            conn.on('open', function() {
                // Receive messages
                conn.on('data', function (data) {
                    setName(data)
                });

                // Send messages
                conn.send(peerObj);
            })

            $(".online-duet").attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
        })
        peer.on('close', function () {
            peer = null;
            console.log('Connection destroyed. Please refresh');
        });
    } else {
        console.log("No rooms found")
    }
}

/*/////////////   EXIT ONLINE DUET   ////////////////*/

function exitOnlineDuet(roomId) {
    $(`.user-content[data-user=${joinerPeerObj.userId}]`).remove()

    peer.disconnect();
    peer.destroy();

    console.log("Left room with ID: " + roomId)
    $(".remote-video").hide();
    $(".online-duet").attr("data-connect", "false").removeClass("bg-red").addClass("bg-green").text("join online duet").css("color", "")

    let newUrl = document.location.href.split('?')[0];
    window.location = newUrl
}

/*/////////////   RANDOM USER IMAGE   ////////////////*/

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