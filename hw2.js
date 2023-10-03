const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const globalGain = audioCtx.createGain();
globalGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
globalGain.connect(audioCtx.destination);
var mode = ""

// mode radio buttons
function changeMode(radioButton) {
    const labels = document.querySelectorAll('.buttons label');
    
    labels.forEach(label => {
        label.style.color = 'initial';
    });
    
    if (radioButton.checked) {
        radioButton.parentNode.style.color = 'black';
        // Perform any action specific to the selected option here
        if (radioButton.id === 'additiveSynthesis') {
            mode = "additive synthesis";
        } else if (radioButton.id === 'AM') {
            mode = "AM";
        } else if (radioButton.id === 'FM') {
            mode = "FM";
        }
    }
}

// modulation frequency slider
var modSlider = document.getElementById("mod-slider");
var modulationFreq = document.getElementById("modulationFreq");

modSlider.addEventListener("input", function() {
    modulationFreq.textContent = modSlider.value;
});

// depth value slider
var depthSlider = document.getElementById("depth-slider");
var depthValue = document.getElementById("depthValue");

depthSlider.addEventListener("input", function() {
    depthValue.textContent = depthSlider.value;
});

// lfo frequency slider
var lfoFrequencySlider = document.getElementById("lfo-frequency-slider");
var lfoFrequency = document.getElementById("lfo-frequency");

lfoFrequencySlider.addEventListener("input", function() {
    lfoFrequency.textContent = lfoFrequencySlider.value;
});

// lfo gain slider
var lfoGainSlider = document.getElementById("lfo-gain-slider");
var lfoGainVal = document.getElementById("lfo-gain");

lfoGainSlider.addEventListener("input", function() {
    lfoGainVal.textContent = lfoGainSlider.value;
});

// lfo checkbox
var toggleCheckbox = document.getElementById("toggleCheckbox");
        var toggleOutput = document.getElementById("toggleOutput");

        toggleCheckbox.addEventListener("change", function() {
            if (toggleCheckbox.checked) {
                toggleOutput.textContent = "LFO on";
            } else {
                toggleOutput.textContent = "LFO off";
            }
        });

// partials
var partialFrequencies = [];

function addPartial() {
    // Get the input element and its value
    var numberInput = document.getElementById("numberInput");
    var inputValue = parseFloat(numberInput.value); // Convert input value to a number

    if (!isNaN(inputValue)) {
        // Check if the input is a valid number (not NaN)
        // Add the number to the array
        partialFrequencies.push(inputValue);

        // Update the result display
        var resultDisplay = document.getElementById("result");
        resultDisplay.textContent = "Partials: " + partialFrequencies.join(", ");

        // Clear the input field
        numberInput.value = "";
    } else {
        alert("Please enter a valid number.");
    }
}


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
};

const activeOscillators = {};
const activeGainNodes = {};
//const partialFrequencies = [1, 2, 3, 4, 5, 20, 30]; // Frequencies for partials
const envelopeDuration = 0.2; // Envelope duration in seconds

// FM modulation parameters
const modulationIndex = 100; // Adjust this value for modulation depth
const modulationFrequency = modulationFreq.textContent; // Adjust this value for modulation frequency


function keyDown(event) {
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
      playNote(key);
    }
  }
  
function keyUp(event) {
    if (mode == "additive synthesis") {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {

            activeGainNodes[key].gain.cancelScheduledValues(audioCtx.currentTime);
            activeGainNodes[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
            for (var i = 0; i < activeOscillators[key].length; i++) {
                activeOscillators[key][i].stop(audioCtx.currentTime + 0.05)
            }
            delete activeOscillators[key];
            delete activeGainNodes[key]
        }


        } 

        else if (mode == "AM") {
            const key = (event.detail || event.which).toString();
            if (keyboardFrequencyMap[key] && activeOscillators[key]) {

            activeGainNodes[key].gain.cancelScheduledValues(audioCtx.currentTime);
            activeGainNodes[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
            for (var i = 0; i < activeOscillators[key].length; i++) {
                activeOscillators[key][i].stop(audioCtx.currentTime + 0.05)
            }
            delete activeOscillators[key];
            delete activeGainNodes[key]
        }
    }

    else if (mode == "FM") {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {

            activeGainNodes[key].gain.cancelScheduledValues(audioCtx.currentTime);
            activeGainNodes[key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
            for (var i = 0; i < activeOscillators[key].length; i++) {
                activeOscillators[key][i].stop(audioCtx.currentTime + 0.05)
            }
            delete activeOscillators[key];
            delete activeGainNodes[key]
        }
    }

}


  
function playNote(key) {

    if (mode == "additive synthesis") {
        var oscs = [];

        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);

        const gainNode = audioCtx.createGain();
        const timeConstant = 0.1

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        osc.connect(gainNode).connect(globalGain);
        osc.type = "sine"; // waveform

        const partialOscillators = partialFrequencies.map((partial) => {
            const partialOsc = audioCtx.createOscillator();
            const partialFrequency = keyboardFrequencyMap[key] * partial;
            partialOsc.frequency.setValueAtTime(partialFrequency, audioCtx.currentTime);
            partialOsc.connect(gainNode);
            return partialOsc;
        });

        osc.start();

        // adding lfos
        if (toggleCheckbox.checked) {
            var lfo = audioCtx.createOscillator();
            lfo.frequency.value = lfoFrequency.textContent;
            lfoGain = audioCtx.createGain();
            lfoGain.gain.value = lfoGainVal.textContent;
            lfo.connect(lfoGain).connect(osc.frequency);
            lfo.start();
        }

        partialOscillators.forEach((partialOsc) => partialOsc.start());
        activeOscillators[key] = oscs;
        activeGainNodes[key] = gainNode;

        n = Object.keys(activeGainNodes).length;

        Object.keys(activeGainNodes).forEach((key) =>
        activeGainNodes[key].gain.setTargetAtTime(1/(2*n), audioCtx.currentTime, timeConstant)
        );

        gainNode.gain.setTargetAtTime(1/(2*n), audioCtx.currentTime + 0.2, timeConstant);
    
    } else if (mode == "AM") {
        var oscs = []
        const carrierOsc = audioCtx.createOscillator();
        const modulationOsc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        const timeConstant = 0.1


        // set the carrier frequency to the pressed key's frequency
        carrierOsc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);

        const modulationFrequency = modulationFreq.textContent; 
        modulationOsc.frequency.value = modulationFrequency;

        const modulated = audioCtx.createGain();
        const depth = audioCtx.createGain();

        depth.gain.value = depthValue.textContent; //depth value
        modulated.gain.value = 1.0 - depth.gain.value;

        // connect to gain node
        modulationOsc.connect(depth).connect(modulated.gain);
        carrierOsc.connect(modulated);
        modulated.connect(gainNode).connect(globalGain)

        carrierOsc.type = "sine";
        modulationOsc.type = "sine";

        carrierOsc.start();
        modulationOsc.start();

        // adding lfos
        if (toggleCheckbox.checked) {
            var lfo = audioCtx.createOscillator();
            lfo.frequency.value = lfoFrequency.textContent;;
            lfoGain = audioCtx.createGain();
            lfoGain.gain.value = lfoGainVal.textContent;
            lfo.connect(lfoGain).connect(modulationOsc.frequency);
            lfo.start();
        }

        oscs.push(carrierOsc);
        oscs.push(modulationOsc);

        activeOscillators[key] = oscs;
        activeGainNodes[key] = gainNode;

        n = Object.keys(activeGainNodes).length;

        Object.keys(activeGainNodes).forEach((key) =>
        activeGainNodes[key].gain.setTargetAtTime(1/(2*n), audioCtx.currentTime, timeConstant)
        );

        gainNode.gain.setTargetAtTime(1/(2*n), audioCtx.currentTime + 0.2, timeConstant);
    }

    else if (mode == "FM") {
        const carrierOsc = audioCtx.createOscillator();
        const modulationOsc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        var oscs = []
        const modulationIndex = audioCtx.createGain();
        const timeConstant = 0.1;

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

        // set carrier frequency to the pressed key's frequency
        const carrierFrequency = keyboardFrequencyMap[key];
        carrierOsc.frequency.setValueAtTime(carrierFrequency, audioCtx.currentTime);

        // set the modulation frequency and index
        modulationOsc.frequency.value = modulationFreq.textContent;
        modulationIndex.gain.value = 50;

        modulationOsc.connect(modulationIndex);
        modulationIndex.connect(carrierOsc.frequency)
        carrierOsc.connect(gainNode).connect(globalGain)

        carrierOsc.type = "sine";
        modulationOsc.type = "sine";

        carrierOsc.start();
        modulationOsc.start();

        // adding lfos
        if (toggleCheckbox.checked) {
            var lfo = audioCtx.createOscillator();
            lfo.frequency.value = lfoFrequency.textContent;
            lfoGain = audioCtx.createGain();
            lfoGain.gain.value = lfoGainVal.textContent;
            lfo.connect(lfoGain).connect(modulationOsc.frequency);
            lfo.start();
        }

        oscs.push(carrierOsc);
        oscs.push(modulationOsc);

        activeOscillators[key] = oscs;
        activeGainNodes[key] = gainNode;

        n = Object.keys(activeGainNodes).length;

        Object.keys(activeGainNodes).forEach((key) =>
        activeGainNodes[key].gain.setTargetAtTime(1/(2*n), audioCtx.currentTime, timeConstant)
        );

        gainNode.gain.setTargetAtTime(1/(2*n), audioCtx.currentTime + 0.2, timeConstant);

}
}
  
  // add event listeners
  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);