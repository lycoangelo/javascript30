const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap')

navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    video.srcObject = stream;
    video.play();
    video.onloadedmetadata = function (e) {
      drawCanvas();
    }
  })
  .catch(function (err) {
    console.log('Error:', err);
  });

function drawCanvas() {
  ctx.globalCompositionOperation = "lighten";
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();
  let imageURL = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  const img = document.createElement('img');
  img.setAttribute('src', imageURL);
  const imgSRC = img.src;
  link.setAttribute('href', imgSRC);
  link.setAttribute('download', '');
  document.body.append(link);
  link.append(img);
}