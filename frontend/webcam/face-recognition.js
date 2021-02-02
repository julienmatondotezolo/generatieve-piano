//sources used: https://www.youtube.com/watch?v=CVClHLwv-4I&feature=youtu.be&ab_channel=WebDevSimplified

window.onload = function () {
console.log('ayoub tg');
    let emotionColorObj = {
      angry: 'red',
      disgusted: '#0eff00',
      fearful: '#9300ff',
      happy: 'yellow',
      neutral: 'grey',
      sad: '#0065ff',
      surprised: '#ff0068',
    }
  
    let trackedEmotionsArr = [];
    let emotionObj = {};
  
    const video = document.getElementById("video");
  
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
      faceapi.nets.faceExpressionNet.loadFromUri("./models"),
    ]).then(startVideo);
  
    startVideo()
  
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
  
      let scanningFace = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
  
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  
        // faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  
        let expressionsObject = detections[0];
  
        if (typeof expressionsObject !== "object") {
          $('.emotion-txt').text("Searching face...").css('color', 'grey')
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
  
          emotionArr.sort(function (a, b) {
            return b[1] - a[1];
          });
  
          let emotionVal = emotionArr[0][0];
          let emotionLevel = emotionArr[0][1];
  
          emotionObj.level = emotionLevel;
          emotionObj.emotion = emotionVal
          trackedEmotionsArr.push(emotionObj);
  
          $('.emotion-txt').text(`You are ${emotionVal}`).css('color', emotionToColor(emotionVal))
  
          $('body').css({
            'background': `linear-gradient(180deg, rgba(25,25,25,1) 25%, rgba(51,51,51,1) 75%, ${emotionToColor(emotionVal)} 100%)`
          });
          $('.keyboard').attr('data-color', emotionToColor(emotionVal))
          $('.circle-video').css({
            borderColor: emotionToColor(emotionVal)
          })
          $('.keyboard').css({
            borderColor: emotionToColor(emotionVal),
            borderImage: 'none'
          })
        }
  
      }, 1000);
      //maybe change
  
    //   setTimeout(async () => {
    //     console.log(trackedEmotionsArr)
    //   }, 20000)
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
          return emotionColorObj[emotionToColor]
        }
      }
    }
  
  }