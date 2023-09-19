const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const gain = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
var numberGuesses = 0;

var div = document.getElementById("color");
var hidden = document.getElementById("hidden");
hidden.style.color = "white";

gain.connect(filter);
filter.connect(audioCtx.destination);

const globalGain = audioCtx.createGain();
globalGain.gain.setValueAtTime(0.2, audioCtx.currentTime)
globalGain.connect(audioCtx.destination);

const keyboardFrequencyMap = {
    '90': 261.625565300598634,  //Z - C
    '83': 277.182630976872096, //S - C#
    '88': 293.664767917407560,  //X - D
    '68': 311.126983722080910, //D - D#
    '67': 329.627556912869929,  //C - E
    '86': 349.228231433003884,  //V - F
    '71': 369.994422711634398, //G - F#
    '66': 391.995435981749294,  //B - G
    '72': 415.304697579945138, //H - G#
    '78': 440.000000000000000,  //N - A
    '74': 466.163761518089916, //J - A#
    '77': 493.883301256124111,  //M - B
    '81': 523.251130601197269,  //Q - C
    '50': 554.365261953744192, //2 - C#
    '87': 587.329535834815120,  //W - D
    '51': 622.253967444161821, //3 - D#
    '69': 659.255113825739859,  //E - E
    '82': 698.456462866007768,  //R - F
    '53': 739.988845423268797, //5 - F#
    '84': 783.990871963498588,  //T - G
    '54': 830.609395159890277, //6 - G#
    '89': 880.000000000000000,  //Y - A
    '55': 932.327523036179832, //7 - A#
    '85': 987.766602512248223,  //U - B
}

// extra 
const keyboardColorMap = {
    '90': "rgba(255, 0, 0, 1)",  //Z - C
    '83': "rgba(255, 0, 0, 0.6)", //S - C#
    '88': "rgba(255, 0, 0, 0.3)",  //X - D
    '68': "rgba(255, 153, 0, 1)", //D - D#
    '67': "rgba(255, 153, 0, 0.6)",  //C - E
    '86': "rgba(255, 153, 0, 0.3)",  //V - F
    '71': "rgba(255, 199, 0, 1)", //G - F#
    '66': "rgba(255, 199, 0, 0.6)",  //B - G
    '72': "rgba(255, 199, 0, 0.3)", //H - G#
    '78': "rgba(143, 255, 0, 1)",  //N - A
    '74': "rgba(143, 255, 0, 0.6)", //J - A#
    '77': "rgba(143, 255, 0, 0.3)",  //M - B
    '81': "rgba(40, 126, 0, 1)",  //Q - C
    '50': "rgba(40, 126, 0, 0.6)", //2 - C#
    '87': "rgba(40, 126, 0, 0.3)",  //W - D
    '51': "rgba(0, 133, 255, 1)", //3 - D#
    '69': "rgba(0, 133, 255, 0.6)",  //E - E
    '82': "rgba(0, 133, 255, 0.3)",  //R - F
    '53': "rgba(82, 0, 255, 1)", //5 - F#
    '84': "rgba(82, 0, 255, 0.6)",  //T - G
    '54': "rgba(82, 0, 255, 0.3)", //6 - G#
    '89': "rgba(189, 0, 255, 1)",  //Y - A
    '55': "rgba(189, 0, 255, 0.6)", //7 - A#
    '85': "rgba(189, 0, 255, 0.3)",  //U - B
}

window.addEventListener('keydown', keyDown, false);
window.addEventListener('keyup', keyUp, false);

var waveform = "sawtooth";

function sawtooth() {
    waveform = "sawtooth";
}
function sine() {
    waveform = "sine";
}

const activeOscillators = {};
const activeGainNodes = {}; //part 2

function keyDown(event) {
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
        playNote(key);

        // extra
        var guess = document.getElementById("guess");
        guess.style.backgroundColor = keyboardColorMap[key];

        numberGuesses = numberGuesses + 1;
        if (numberGuesses == 1) {
            document.getElementById("guess").innerHTML = numberGuesses + " guess";
        }
        else {
            document.getElementById("guess").innerHTML = numberGuesses + " guesses";
        }

        if (guess.style.backgroundColor == div.style.backgroundColor) {
            hidden.style.color = "black";
            document.getElementById("play").innerHTML = "play again?";
            numberGuesses = 0;
        }
    }
}

function keyUp(event) {
    
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {


        const osc = activeOscillators[key];
        const gainNode = activeGainNodes[key];
        const currentTime = audioCtx.currentTime;

        // envelope
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setTargetAtTime(gainNode.gain.value, currentTime, 0.5); 
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2); //gets rid of click sound

        osc.stop(currentTime + 0.2);

        delete activeOscillators[key];
        delete activeGainNodes[key];

    }
}



function playNote(key) { 


    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
    osc.type = waveform;
    const gainNode = audioCtx.createGain();
    const timeConstant = 0.1

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    osc.connect(gainNode).connect(globalGain);
    osc.start();

    activeOscillators[key] = osc;
    activeGainNodes[key] = gainNode;
    n = Object.keys(activeGainNodes).length;

    Object.keys(activeGainNodes).forEach((key) =>
      activeGainNodes[key].gain.setTargetAtTime(1/(2*n), audioCtx.currentTime, timeConstant)
    );

    gainNode.gain.setTargetAtTime(1/(2*n), audioCtx.currentTime + attack, timeConstant);

}

// extra - color guessing game :)

function newColor() {
    numberGuesses = 0;
    document.getElementById("guess").innerHTML = numberGuesses + " guesses";
    const keysArray = Object.keys(keyboardColorMap);
    const randomIndex = Math.floor(Math.random() * keysArray.length);
    const randomKey = keysArray[randomIndex];
    hidden.style.color = "white";
    
    div.style.backgroundColor = keyboardColorMap[randomKey]
  
}
