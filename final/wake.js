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

        function updateBlur() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;

            var blurValue = Math.min(10, average / 10); 
            videoPlayer.style.filter = 'blur(' + blurValue + 'px)';
        }


        function updateColors() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;

            var colorValue = Math.min(255, average * 2);

            videoContainer.style.filter = "hue-rotate(" + colorValue + "deg)";

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

        function updateClipPath() {
            analyser.getByteFrequencyData(dataArray);
        
            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;
        
            var clipPathValue = average / 255;
        
            // Apply the clip path
            videoContainer.style.clipPath = "circle(" + clipPathValue * 200 + "% at center)";
        }


        function updateOpacity() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;

            var opacityValue = average / 255;

            videoContainer.style.opacity = opacityValue * 5;
        }

        // call functions
        function updateLoop() {
            updateBlur();
            updateColors();
            updateOpacity();
            updatePlaybackSpeed();
            updateClipPath();
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
