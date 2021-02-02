"use strict";

let username;

if (localStorage.getItem("username") !== undefined) {
    console.log('already a user');
  //  window.location.href = "index.html";
  }
  
    setTimeout(() => {
        hideWelcomeText();
        showEnterName();
    }, 1000)




let enterNameToWebcam = () => {

    document.getElementById('start-button').addEventListener('click', (e) => {
        username = document.getElementById('username-input').value;
        checkIfValidInput();
    })

    let checkIfValidInput = () => {
        if(username == "") {
            showAndHideUnvalidUsername();
        } else {
            saveUserNameToLocalStorage(username);
            hideEnterName();
            showFaceRecoDisclaimer();
        }
    }

    //////////////////////////// FUNCTION TO SHOW SAVE SHOW AND HIDE UNVALID USERNAME TEXT IF USER INPUT EMPTY ////////////////////////////

    let showAndHideUnvalidUsername = () => {

        document.getElementById('unvalid-username').style.display = 'block';
        setTimeout(() => {
            document.getElementById('unvalid-username').style.display = 'none';
        }, 2000)
    }

    //////////////////////////// FUNCTION TO SHOW SAVE USERNAME TO LOCAL STORAGE ////////////////////////////

    let saveUserNameToLocalStorage = (name) => {
        localStorage.setItem('username', name);
    }

    //////////////////////////// FUNCTION TO HIDE ENTER NAME INPUT AND TEXT ////////////////////////////

    let hideEnterName = () => {
        document.getElementById('enter-name-container').style.display = 'none';
    }

    //////////////////////////// FUNCTION TO SHOW FACE RECOGNITION DISCLAIMER ////////////////////////////

    let showFaceRecoDisclaimer = () => {

        document.getElementById('container-face-recognition').style.display = 'flex';

        let div = document.createElement("div");
        div.id = 'face-recognition-disclaimer';
        let faceRecognitionContainer = document.getElementById("container-face-recognition");
        faceRecognitionContainer.appendChild(div);

        $.get("webcam/webcam.html", function(content) {
            // console.log( 'Webcam DATA HTML', content )
            console.log(content);
            $('#container-face-recognition').append(content);
           /*  let script = document.createElement('script');
            script.src = 'webcam/face-recognition.js';
            document.body.appendChild(script); */
        });


        console.log('Webcam is loaded.');

        faceRecognitionContainer.innerHTML = `
        <div>
           <p>Hi ${username}, this app is using <br> face recognition.</p> 
        </div>

        
        `;
    }

}

enterNameToWebcam();

//////////////////////////// FUNCTION TO HIDE WELCOME TEXT ////////////////////////////

  let hideWelcomeText = () => {
    document.getElementById('welcome-container').style.display = 'none';
}

//////////////////////////// FUNCTION TO SHOW ENTER NAME INPUT AND TEXT ////////////////////////////

let showEnterName = () => {
    document.getElementById('enter-name-container').style.display = 'flex';
}





