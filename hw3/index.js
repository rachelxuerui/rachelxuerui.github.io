var globalGain;
var noiseEnv;
var feedbackDelay;
const startButton = document.getElementById("start");

startButton.addEventListener('click', function () {

    initAudio();


})

function lowpass(frequency) {

        var lpf = audioCtx.createBiquadFilter();
        lpf.type = "lowpass";
        lpf.frequency.value = frequency;
        return lpf

}  

function brown(audioCtx) {

    var bufferSize = 10 * audioCtx.sampleRate,
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;
    
        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    var brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);

    return brownNoise;

}

function initAudio() {

    audioCtx = new AudioContext();
    globalGain = audioCtx.createGain();
    globalGain.gain.value = 0.1;
    globalGain.connect(audioCtx.destination);

    var lpf1 = lowpass(400);

    var lpf2 = lowpass(14);

    var hpf = audioCtx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.Q.value = 33.33;
    hpf.frequency.value = 500;

    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 1000;

    var brownNoise1 = brown(audioCtx);
    var brownNoise2 = brown(audioCtx);
    
    brownNoise2.connect(lpf2).connect(gainNode).connect(hpf.frequency);
    brownNoise1.connect(lpf1).connect(hpf).connect(globalGain);

}


