const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const progress = player.querySelector(".progress");
const progress_filled = player.querySelector(".progress__filled");

const player_button = player.querySelector(".player__button");

const volume = player.querySelector("input[name = 'volume']");
const playbackRate = player.querySelector("input[name = 'playbackRate']");
// ^^ could use one selector 
//const ranges = player.querySelectorAll('.player__slider');
const skipAhead_button = player.querySelector("button[data-skip = '25']");
const skipBack_button = player.querySelector("button[data-skip = '-10']");

// console.dir(video)

let progressPercent;

function togglePause() {
    if (video.paused) {
        video.play();
        // player_button.innerHTML = '‖';
    } else {
        video.pause();
        // player_button.innerHTML = '►';
    } 
    //^^^^ alternative
    // const method = video.paused ? 'play' : 'pause';
    // video[method]();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    player_button.textContent = icon;
}
// allows the play/pause button to change when playing/pausing from a plugin

video.addEventListener('click', togglePause)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)

player_button.addEventListener('click', togglePause);

function adjustProgress() {
    progressPercent = (video.currentTime / video.duration) * 100;
    progress_filled.style.flexBasis = `${progressPercent}%`;
}
// setInterval(adjustProgress, 1000);
video.addEventListener('timeupdate', adjustProgress);

function range() {
    video[this.name] = this.value;
}

volume.addEventListener('change', range);
playbackRate.addEventListener('change', range);

function skip(){
    video.currentTime += parseFloat(this.dataset.skip)
}
skipAhead_button.addEventListener('click', skip);
skipBack_button.addEventListener('click', skip);

function scrub(e) {
  if (!isScrubbing) return;
    let midPt = window.innerWidth / 2;
    let startClient = midPt - (progress.clientWidth / 2);
    let endClient = midPt + (progress.clientWidth / 2);

    let distFromStart = e.clientX - startClient;
    let percentFinished = (distFromStart / endClient) * 100;

    progress_filled.style.flexBasis = `${percentFinished}%`;
    video.currentTime = (percentFinished / 100)* video.duration;
}

function scrubb(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}
progress.addEventListener('click', scrubb);

let isScrubbing = false;

progress.addEventListener("mousedown", () => isScrubbing = true);
progress.addEventListener("mousemove", scrub);
//^ alternative but it is laggy for updating
// progress.addEventListener('mousemove', (e) => mousedown && scrubb(e))
progress.addEventListener("mouseup", () => isScrubbing = false);