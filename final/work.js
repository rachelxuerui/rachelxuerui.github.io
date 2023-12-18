document.addEventListener('DOMContentLoaded', function () {
    var sonicPiVideo = document.getElementById('sonicPi');
    var videoPlayer = document.getElementById('videoPlayer');
    var videoContainer = document.getElementById('videoContainer');

    var userHasInteracted = false;

    var audioContext;
    var analyser;
    var style = document.createElement('style');
    document.head.appendChild(style);

    function initializeAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        var source = audioContext.createMediaElementSource(sonicPiVideo);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        function updateEffects() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;

            var normalizedAverage = average / 255;

            var filterValue = "sepia(" + normalizedAverage + ") saturate(" + (1 + normalizedAverage * 10) + ")";

            var dreamlikeValue = average / 255;
            filterValue += " blur(" + dreamlikeValue + "px) brightness(" + (0.8 + dreamlikeValue) + ")" + ' contrast(' + dreamlikeValue*10 + ')';;

            videoContainer.style.filter = filterValue;
        }

        function updateZoom() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);

            var average = sum / bufferLength;

            var zoomValue = 1 + average / 500; 


            videoContainer.style.transform = 'scale(' + zoomValue + ')';
        }

        // call functions
        function updateLoop() {
            updateEffects();
            updateZoom();
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
