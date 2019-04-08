const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const toggles = document.querySelectorAll('.effectToggle');
let effects = [
  { name: 'RE', state: false },
  { name: 'RS', state: false },
  { name: 'GS', state: false },
  { name: 'DE', state: true }
];

function toggleEffect() {
  effects.map((effect, index) => {
    if (effect.name === this.name) {
      effect.state = true;
    } else {
      effect.state = false;
    }
  })
}

toggles.forEach(toggle => toggle.addEventListener('click', toggleEffect));

function displayVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      const videoPlay = video.play();
      video.onloadedmetadata = function (e) {
        drawCanvas(videoPlay);
      }
    })
    .catch(function (err) {
      console.log('Error:', err);
    });
}

displayVideo();

function drawCanvas(videoPlay) {
  setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    effects.map(effect => {
      if (effect.name == 'RE' && effect.state == true) {
        pixels = redEffects(pixels);
      } else if (effect.name == 'RS' && effect.state == true) {
        pixels = rgbSplit(pixels);
      } else if (effect.name == 'GS' && effect.state == true) {
        pixels = greenScreen(pixels);
      } else if (effect.name == 'DE' && effect.state == true) {
        pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
      }
    })
    ctx.putImageData(pixels, 0, 0);
  }, 16);
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
  strip.prepend(link);
  link.append(img);
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 100] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 200] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function redEffects(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 100; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] - 100; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

video.addEventListener('playing', drawCanvas);