//sources used: https://www.youtube.com/watch?v=CVClHLwv-4I&feature=youtu.be&ab_channel=WebDevSimplified
"use strict";

import {
    autoplayNotes
} from '../src/keyboard.js';

let emotionColorObj = {
    angry: 'red',
    disgusted: '#0eff00',
    fearful: '#9300ff',
    happy: 'yellow',
    neutral: 'grey',
    sad: '#0065ff',
    surprised: '#ff0068',
};

let video = document.getElementById("video");
let noUserIcon = document.getElementById("noUserIcon");
let trackedEmotionsArr = [];
let boolean = true;





// Function to start the WebCam
function startVideo() {
    // loader(true);
    video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        .then(stream => {
            window.localStream = stream;
            video.srcObject = stream;
            // audio.srcObject = stream;
            faceApi();
        })
        .catch((err) => {
            console.log(err);
        });
}

setTimeout(() => {
    openAndCloseCamera();
}, 2500);
// Desactive your webcam when clicked on the video button ///
function openAndCloseCamera() {
    $(".video").on('click', function() {
        let video = document.getElementById("video");
        let noUserIcon = document.getElementById("noUserIcon");
        if (boolean) { // Desactive the webcam
            $("#video").attr('actived', "false");
            $(".video").addClass('icon-devices-desactivated'); // Add red background to the button to mark it as "desactived"
            video.srcObject.getTracks().forEach(function(track) { // Code to stop the webcam
                track.stop();
                track.src = "";
            });

            console.log(video);
            video.setAttribute('class', 'displayNone');
            noUserIcon.removeAttribute('class', 'displayNone');
            $('.emotion-txt').text(`Your webcam is not open `).css('color', 'grey');

        } else { // Active the webcam
            navigator.mediaDevices.getUserMedia({ // Code to reopen the webcam
                    audio: false,
                    video: true
                })
                .then(stream => {
                    window.localStream = stream;
                    video.srcObject = stream;
                    //audio.srcObject = stream; // For the audio
                });

            noUserIcon.setAttribute('class', 'displayNone');
            video.removeAttribute('class', 'displayNone');
            $('.emotion-txt').text(`Searching face...`).css('color', 'grey');
            $("#video").attr('actived', "true");
            $(".video").removeClass('icon-devices-desactivated'); // Remove the red background
        }
        boolean = !boolean;
    });
}



function openAndCloseVideo() {
    $(".micro").on('click', function() {
        let micro = document.getElementById("micro");
        if (boolean) { // Desactive the webcam
            $("#video").attr('actived', "false");
            $(".video").addClass('icon-devices-desactivated'); // Add red background to the button to mark it as "desactived"
            video.srcObject.getTracks().forEach(function(track) { // Code to stop the webcam
                track.stop();
                track.src = "";
            });


        } else { // Active the webcam
            navigator.mediaDevices.getUserMedia({ // Code to reopen the webcam
                    audio: false,
                    video: true
                })
                .then(stream => {
                    window.localStream = stream;
                    video.srcObject = stream;
                    //audio.srcObject = stream; // For the audio
                });

            noUserIcon.setAttribute('class', 'displayNone');
            video.removeAttribute('class', 'displayNone');
            $('.emotion-txt').text(`Searching face...`).css('color', 'grey');
            $("#video").attr('actived', "true");
            $(".video").removeClass('icon-devices-desactivated'); // Remove the red background
        }
        boolean = !boolean;
    });
}
// Function to exit the normal mode
export function exitNormalMode() {
    console.log("[EXIT] normal mode");
    let checkMode = $(".keyboard").attr('data-mode');
    clearInterval(window.sendEmotionsInterval);
    if (checkMode === "online") {
        clearInterval(window.scanningFace);
    }
}

// Function to start the Normal mode
export function loadNormalMode() {
    console.log("[START] normal mode");
    clearInterval(window.scanningFace);
    clearInterval(window.sendEmotionsInterval);
    startVideo();
}

function faceApi() {
    //  video.addEventListener("play", () => {
    //  const canvas = faceapi.createCanvasFromMedia(video);
    //  document.body.append(canvas);
    const displaySize = {
        width: video.width,
        height: video.height
    };
    //    faceapi.matchDimensions(canvas, displaySize);
    let timer = 14;
    window.scanningFace = setInterval(async() => {
        let webcamState = $("#video").attr('actived');
        console.log(webcamState);
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        // const resizedDetections = faceapi.resizeResults(detections, displaySize);
        // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        // faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        let expressionsObject = detections[0];
        if (typeof expressionsObject !== "object" && webcamState === "true") {
            $('.emotion-txt').text(`Searching face...`).css('color', 'grey');
            $('body').css({
                'background': `linear-gradient(180deg, rgba(25,25,25,1) 25%, rgba(51,51,51,1) 75%, grey 100%)`
            });
            console.log("fyn");
        } else {
            loader(false);
            let text;
            let emotionVal;
            checkMode = $(".keyboard").attr('data-mode');
            console.log(checkMode);
            if (webcamState === "true") { // If the webcam is open => For the bot mode and normal mode
                expressionsObject = detections[0].expressions;
                let emotionArr = [];
                for (let emotion in expressionsObject) {
                    emotionArr.push([emotion, expressionsObject[emotion]]);
                }

                emotionArr.sort(function(a, b) {
                    return b[1] - a[1];
                });

                emotionVal = emotionArr[0][0];
                let emotionLevel = emotionArr[0][1];
                let emotionObj = {
                    "emotion": emotionVal,
                    "level": emotionLevel
                };

                trackedEmotionsArr.push(emotionObj);
                text = `You are ${emotionVal}`;
                if (checkMode === "false") { // In the normal mode, it wil add a timer untill it will fetch the emotions of the user
                    text += ' ' + timer;
                }

            } else { // If the webcam is closed => For the BOT mode and the NORMAL mode
                console.log("Webcam is not open");
                text = `Your webcam is not open`;
            }
            $('.emotion-txt').text(`${text}`).css('color', emotionColorObj[emotionVal], );
            $('body').css({
                'background': `linear-gradient(180deg, rgba(25,25,25,1) 25%, rgba(51,51,51,1) 75%, ${emotionColorObj[emotionVal]} 100%)`
            });
            $('.keyboard').attr('data-color', emotionColorObj[emotionVal]);
            $('.circle-video').css({
                borderColor: emotionColorObj[emotionVal]
            });
            $('.keyboard').css({
                borderColor: emotionColorObj[emotionVal],
                borderImage: 'none'
            });
        }
        /* TIMER */
        timer = timer - 1;
        if (timer === 0) {
            timer = 15;
        }
    }, 1000);
    let checkMode = $(".keyboard").attr('data-mode');
    if (checkMode === "false") { // Normal Mode
        window.sendEmotionsInterval = setInterval(async() => {
            console.log(trackedEmotionsArr);
            // clearInterval(scanningFace); // TO STOP THE INTERVAL
            sendUserEmotionsToAI(trackedEmotionsArr).then(data => {
                console.log(data); // == Data created by the AI, depending the emotions of the user (by the trackedEmotionsArr)
                // Exported function from /keyboard.js. Call the function to automatically play the fetched data
                if (data.length !== 0) {
                    autoplayNotes(data.notesObject);
                }
            }).catch(error => {
                console.log("error", error);
            });
            trackedEmotionsArr = [];
        }, 15000);

    } else if (checkMode === "bot") {
        loader(false);
        clearInterval(window.sendEmotionsInterval);
        console.log("BOT MODE");
    } else {
        loader(false);
        clearInterval(window.sendEmotionsInterval);
        clearInterval(window.scanningFace);
        console.log("Desactive all interval");
    }
}

// Send array of object of emotions of the user to the backend. Then you receive an object of notes by the IA, depending the most common emotion of the user
async function sendUserEmotionsToAI(notes) {
    const rawResponse = await fetch('https://paino-fp3.herokuapp.com/emotion-to-notes', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
    });

    if (rawResponse.status === 200) {
        return await rawResponse.json();
    } else {
        console.log("error getting data!");
    }
}

function loader(status) {
    if (status) {
        $('.loader').remove();
        $('body').prepend(`
        <div class="loader">
          <div class="loader-spinner"></div>
        </div>
      `);
    } else {
        $('.loader').remove();
    }
}