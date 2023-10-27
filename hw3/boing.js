var audioCtx;

const startButton = document.getElementById("start");
const ball = document.getElementById("ball");


// modulation frequency slider
var minSlider = document.getElementById("min-slider");
var minAmp = document.getElementById("min-amp");

minSlider.addEventListener("input", function() {
    minAmp.textContent = minSlider.value;
});

var maxSlider = document.getElementById("max-slider");
var maxAmp = document.getElementById("max-amp");

maxSlider.addEventListener("input", function() {
    maxAmp.textContent = maxSlider.value;
});


startButton.addEventListener('click', function () {
    initAudio(-10);
})

function boing(audioCtx, dampening) {
    var min = parseInt(minAmp.textContent);
    var max = parseInt(maxAmp.textContent);
    var bufferSize = Math.ceil(audioCtx.sampleRate * (100));
    var outputBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var outputData = outputBuffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
        var t = i / audioCtx.sampleRate;
        var frequency = min + (max - min) * Math.abs(Math.sin(2 * Math.PI * 0.1 * t));
        outputData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(dampening * t);
    }

    var bounceSoundSource = audioCtx.createBufferSource();
    bounceSoundSource.buffer = outputBuffer;
    bounceSoundSource.connect(audioCtx.destination);

    bounceSoundSource.start();

    return bounceSoundSource;
}

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    globalGain = audioCtx.createGain();
    globalGain.gain.value = 0.1;
    globalGain.connect(audioCtx.destination);

    var lpf = audioCtx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 100;

    var hpf = audioCtx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.Q.value = 33.33;
    hpf.frequency.value = 500;

    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 1000;

    var dampening = -10;
    var delay = 500;

    
    async function playWithDelay() {
        while (delay > 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay /= 1.2; // lower delay

            var b = boing(audioCtx, dampening);

            dampening = dampening - 1.5; // lower dampening

            // connect
            b.connect(lpf);
            b.connect(gainNode);
            lpf.connect(hpf);
            hpf.connect(globalGain);
            globalGain.connect(audioCtx.destination);
            
        }
    }

    playWithDelay();
    bounce(10, 6, 4);

}

const bounce = (position, velocity, gravity, endCallback) => {
    const animateBounce = () => {
        position += velocity;
        velocity += gravity;

        if (position >= window.innerHeight - ball.clientHeight) {
            position = window.innerHeight - ball.clientHeight;
            velocity = -velocity * 0.5;
        }

        ball.style.top = position + 'px';

        if (position >= window.innerHeight - ball.clientHeight && Math.abs(velocity) < 1) {
            endCallback();
        } else {

            requestAnimationFrame(animateBounce);
        }
    };

    animateBounce();
};

