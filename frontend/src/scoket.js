/*/////////////   RANDOM USER IMAGE   ////////////////*/

randomUserImage();

function randomUserImage() {
    let randomNumber = Math.floor(Math.random() * 25) + 1;
    let randomDegrees = Math.floor(Math.random() * 360);

    $(".random-logo").attr("src", `images/icons/${randomNumber}.png`);
    $(".random-logo").css("filter", `hue-rotate(${randomDegrees}deg) saturate(2)`);
}

/*/////////////   JOIN ONLINE DUET   ////////////////*/

let lastPeerId = null;
let peer = null; // own peer object
let peerObj = {}
let roomId = getUrlParameter('')

$(".online-duet").click(function (e) { 
    e.preventDefault();

    let checkStatus = $(this).attr("data-connect");

    if (checkStatus === "false") {
        let username = prompt("Please enter your name", "Enter your name");

        if (username !== "" && username !== "Enter your name") {
            peerObj.username = username
            initPeerConn()
            $(this).attr("data-connect", "true").removeClass("bg-green").addClass("bg-red").text("exit online duet").css("color", "#fff")
        } else {
            alert("Enter a valid name !")
        }

    } else {
        $(this).attr("data-connect", "false").removeClass("bg-red").addClass("bg-green").text("join online duet").css("color", "")
        peer.destroy()
    }

});

function initPeerConn() {
    peer = new Peer();

    peer.on('open', function(id) {
        peerObj.userId = id

        let url = document.location.href + "?room=" + id;
        document.location = url;

        console.log('My peer ID is: ' + id);
    });

    peer.on('close', function() {
        let url = document.location.href
        document.location = url;
        console.log('Connection destroyed. Please refresh');
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