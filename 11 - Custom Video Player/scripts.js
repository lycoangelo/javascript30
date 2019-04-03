const videoToggle = document.querySelector('.toggle');
const video = document.querySelector('video.viewer');
const skipButtons = document.querySelectorAll('[data-skip]');
const rangeBtns = document.querySelectorAll('input[type="range"]');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled')

progressBar.style.flexBasis = 0;

function handleVideo() {
  const videoMethod = video.paused ? 'play' : 'pause';

  video[videoMethod]();
}

function updateVideoIcon() {
  videoToggle.textContent = video.paused ? '►' : '||';
}

function skip() {
  video.currentTime += parseInt(this.dataset.skip);
}

function updateRange() {
  video[this.name] = this.value;
}

function handleProgress() {
  const progress = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${ progress }%`;
}

function scrub(e) {
  const time = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = time;
}

videoToggle.addEventListener('click', handleVideo);
video.addEventListener('click', handleVideo);
video.addEventListener('play', updateVideoIcon);
video.addEventListener('pause', updateVideoIcon);
video.addEventListener('timeupdate', handleProgress);
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));
rangeBtns.forEach(rangeButton => rangeButton.addEventListener('change', updateRange));
rangeBtns.forEach(rangeButton => rangeButton.addEventListener('mousemove', updateRange));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', (b) => mousedown && scrub(b));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);