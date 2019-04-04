const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia(
    {
      video: true
    },
    function (play) {
      var video = document.querySelector('video');
      video.srcObject = play;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    },
    function (err) {
      console.log("Error: " + err.name);
    }
  );
} else {
  console.log("Not supported.");
};