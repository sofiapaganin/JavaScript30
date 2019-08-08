const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        video.srcObject = localMediaStream;
        video.play();
    })
    .catch(err => {
        console.error('Oh No!!', err);
    });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
        let pixels = ctx.getImageData(0, 0, width, height);
        // ^ take pixels outs
        // pixels = blueEffect(pixels);
        pixels = greenScreen(pixels)
        // ^ mess with pixels
        // ctx.globalAlpha = 0.1;
        //  ^ 10% transparency - ghosting effect
        ctx.putImageData(pixels, 0, 0)
        // ^ put them back
    }, 16)
    //  ^^^ why doesn't this work without setInterval?
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
//     const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     // console.log(data)
//     // data.toDataURL
// data.data.join();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'mypic');
    link.innerHTML = `<img src="${data}" alt="Handsome Woman" />`;    
    strip.insertBefore(link, strip.firstChild);
    // console.log(data)

    // const pic = document.createElement('img');
    // pic.src = data;
    // strip.insertBefore(pic, strip.firstChild);
}

function blueEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4){
        pixels.data[i] = pixels.data[i] -50;
        pixels.data[i + 1] = pixels.data[i + 1] + 50;
        pixels.data[i + 2] = pixels.data[i + 2] *2.5;
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4){
        pixels.data[i - 150] = pixels.data[i];
        pixels.data[i + 100] = pixels.data[i + 1];
        pixels.data[i - 250] = pixels.data[i + 2];
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    // console.log(levels)
    for(let i = 0; i < pixels.data.length; i += 4){
        red = pixels.data[i];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue > levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                pixels.data[i + 3] = 0;
                //  ^ take it out
            }
    }
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);

// paintToCanvas();
// console.log(video.srcObject)
// ctx.drawImage(video.srcObject, 10, 10)