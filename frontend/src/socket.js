"use strict";

let userId;
let call = null;
let stream = null;
let getStream;

const video = document.getElementById("video");

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

let getUserCookie = () => {
  userId = Cookies.get("userId");
  return userId;
};

let checkCookie = () => {

  if (!getUserCookie()) {

    userId = uuidv4();
    Cookies.set("userId", `${userId}`, { expires: 1000, path: "" });

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/create-users",
      data: { userId: userId },
      dataType: "json",
    }).done((data) => {
      console.log(data);
    });

  }
};

checkCookie();

  
$.ajax({
  type: "GET",
  url: "http://localhost:3000/send-users",
  dataType: "json",
}).done((data) => {

  console.log(data);
  let peer = new Peer(userId);
  peer.on("open", function (id) {

    console.log("My peer ID is: " + id);

    let filteredUsers = data.users.filter((element) => element !== userId);
    let randomIndex = Math.round(Math.random() * filteredUsers.length - 1);
    let userToConnect = filteredUsers[randomIndex];
    console.log(userToConnect);

    document.querySelector(".online-duet").addEventListener("click", () => {

      if (userId) {
        let conn = peer.connect(userToConnect);

        conn.on("open", function () {
          //conn.send({ test: "are you the incognito browser ?" });
          console.log("open1");
          call = peer.call(userToConnect, getStream);
          console.log("open2");
          console.log(call);
          
        });

        peer.on("call", function (videoCall) {
          
          let videoStream = videoCall.answer(getStream);
          console.log(videoStream);
        
        });
      
      }
    });
  });
});
