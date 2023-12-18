document.addEventListener('DOMContentLoaded', function () {
    var sonicPiVideo = document.getElementById('sonicPi');
    var videoPlayer = document.getElementById('videoPlayer');
    var videoContainer = document.getElementById('videoContainer');

    var userHasInteracted = false;

    var audioContext;
    var analyser;

    function initializeAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();

        var source = audioContext.createMediaElementSource(sonicPiVideo);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
   
        function updateColors() {
            analyser.getByteFrequencyData(dataArray);
        
            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;
        
            var normalizedAverage = average / 255;
        
            videoContainer.style.filter = "sepia(" + normalizedAverage + ") saturate(" + (1 + normalizedAverage * 10) + ")";
        }
        
        function updateJiggle() {
            analyser.getByteFrequencyData(dataArray);
        
            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;
        
            var jiggleValue = average;
        
            if (jiggleValue < 20) {
                videoContainer.style.transform = 'translate(' + jiggleValue + 'px, ' + jiggleValue + 'px)';
            } else {
                videoContainer.style.transform = 'translate(-' + jiggleValue + 'px, -' + jiggleValue + 'px)';
            }
    
        }

        function updatePlaybackSpeed() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);

            var average = sum / bufferLength;

            var speedValue = 0.5 + (average / 255) * 1.5; 

            videoPlayer.playbackRate = speedValue*5;
        }

        function updateRadialBlur() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);

            var average = sum / bufferLength;

            var blurValue = average / 5; 

            console.log(blurValue);

            videoContainer.style.background = 'radial-gradient(circle, transparent, rgba(' + 10*blurValue + ',' + 10*blurValue + ',' + 10*blurValue + ')' + blurValue + ')';
        }
        

        // call functions
        function updateLoop() {
            updateColors();
            updateJiggle();
            updatePlaybackSpeed();
            updateRadialBlur();
            requestAnimationFrame(updateLoop);
        }

        updateLoop();
    }

    function handleUserInteraction() {
        if (!userHasInteracted) {
            initializeAudioContext();
            userHasInteracted = true;

            videoPlayer.play();
            sonicPiVideo.play();
        }
    }

    document.addEventListener('click', handleUserInteraction);
});
