//sources used: https://www.youtube.com/watch?v=CVClHLwv-4I&feature=youtu.be&ab_channel=WebDevSimplified

window.onload = function () {

  let emotionObj = {
    angry: 'red',
    disgusted: '#0eff00',
    fearful: '#9300ff',
    happy: 'yellow',
    neutral: 'grey',
    sad: '#0065ff',
    surprised: '#ff0068',
  }

  const video = document.getElementById("video");

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  ]).then(startVideo);

  function startVideo() {
    loader(true);
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

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      let expressionsObject = detections[0];

      if (typeof expressionsObject !== "object") {
        // loader(true);
        $('.emotion-txt').text("No face detected")
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

        let emotion = emotionArr[0][0];
        let emotionLevel = emotionArr[0][1];

        $('.emotion-txt').text(`You are ${emotion}`).css('color', emotionToColor(emotion))

        $('body').css({
          'background': `linear-gradient(180deg, rgba(25,25,25,1) 25%, rgba(51,51,51,1) 75%, ${emotionToColor(emotion)} 100%)`
        });
      }
    }, 100); //maybe change
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

    for (const emotionToColor in emotionObj) {

      if (emotionToColor === emotion) {
        return emotionObj[emotionToColor]
      }

    }

  }

}