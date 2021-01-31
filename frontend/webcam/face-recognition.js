//sources used: https://www.youtube.com/watch?v=CVClHLwv-4I&feature=youtu.be&ab_channel=WebDevSimplified
"use strict";
import {
    autoplayNotes,

} from '../src/keyboard.js';


window.onload = function() {

    let emotionColorObj = {
        "angry": 'red',
        "disgusted": '#0eff00',
        "fearful": '#9300ff',
        "happy": 'yellow',
        "neutral": 'grey',
        "sad": '#0065ff',
        "surprised": '#ff0068',
    };

    let trackedEmotionsArr = [];


    const video = document.getElementById("video");

    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
        faceapi.nets.faceExpressionNet.loadFromUri("./models"),
    ]).then(startVideo);



    function startVideo() {
        // loader(true);
        navigator.getUserMedia({
                video: {}
            },
            (stream) => (video.srcObject = stream),
            (err) => console.error(err)
        );
    }
    video.addEventListener("play", () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displaySize = {
            width: video.width,
            height: video.height
        };
        faceapi.matchDimensions(canvas, displaySize);
        let scanningFace = setInterval(async() => {
            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
            // const resizedDetections = faceapi.resizeResults(detections, displaySize);
            // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            //faceapi.draw.drawDetections(canvas, resizedDetections);
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            let expressionsObject = detections[0];
            if (typeof expressionsObject !== "object") {
                $('.emotion-txt').text("Searching face...").css('color', 'grey');
                $('body').css({
                    'background': `linear-gradient(180deg, rgba(25,25,25,1) 25%, rgba(51,51,51,1) 75%, grey 100%)`
                });
            } else {
                loader(false);
                expressionsObject = detections[0].expressions;
                let emotionArr = [];
                for (let emotion in expressionsObject) {
                    emotionArr.push([emotion, expressionsObject[emotion]]);
                }
                emotionArr.sort(function(a, b) {
                    return b[1] - a[1];
                });

                let emotionVal = emotionArr[0][0];
                let emotionLevel = emotionArr[0][1];
                let emotionObj = {
                    "emotion": emotionVal,
                    "level": emotionLevel
                };

                trackedEmotionsArr.push(emotionObj);

                $('.emotion-txt').text(`You are ${emotionVal}`).css('color', emotionColorObj[emotionVal]);
                $('body').css({
                    'background': `linear-gradient(180deg, rgba(25,25,25,1) 25%, rgba(51,51,51,1) 75%, ${emotionColorObj[emotionVal]} 100%)`
                });
                $('.keyboard').attr('data-color', emotionColorObj[emotionVal]);
                $('.keyboard').css({
                    borderColor: emotionColorObj[emotionVal],
                    borderImage: 'none'
                });
            }
        }, 1500);
        setTimeout(async() => {
            console.log(trackedEmotionsArr);
            //     clearInterval(scanningFace); // TO STOP THE INTERVAL

            sendUserEmotionsToAI(trackedEmotionsArr).then(data => {
                console.log(data); // == Data created by the AI, depending the emotions of the user (by the trackedEmotionsArr)

                // Exported function from /keyboard.js. Call the function to automatically play the fetched data
                autoplayNotes(data.notesObject);
            });



        }, 5000);
    });

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

    function emotionToColor(emotion) {
        for (const emotionToColor in emotionColorObj) {
            if (emotionToColor === emotion) {
                return emotionColorObj[emotionToColor];
            }
        }
    }

};



// Send array of object of emotions of the user to the backend. Then you receive an object of notes by the IA, depending the most common emotion of the user
async function sendUserEmotionsToAI(trackedEmotionsArr) {
    const rawResponse = await fetch('https://paino-fp3.herokuapp.com/emotion-to-notes', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trackedEmotionsArr })
    });

    if (rawResponse.status === 200) {
        return await rawResponse.json();
    } else {
        console.log("error getting data!");
    }

}