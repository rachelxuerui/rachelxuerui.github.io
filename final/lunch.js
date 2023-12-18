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

        // set the FFT size 
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        function updateBlur() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;

            var blurValue = Math.min(10, average / 10); // You can adjust the scaling factor as needed
            videoPlayer.style.filter = 'blur(' + blurValue + 'px)';
        }

        
        function updateColors() {
            analyser.getByteFrequencyData(dataArray);
        
            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;
        
            // Normalize the average frequency between 0 and 1
            var normalizedAverage = average / 255;
        
            // Apply the combined filter with sepia and saturation
            videoContainer.style.filter = "sepia(" + normalizedAverage + ") saturate(" + (1 + normalizedAverage * 10) + ")";
        }
        
        

        function updatePlaybackSpeed() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;

            videoPlayer.playbackRate = (average/15);
        }

        function updateSkew() {
            analyser.getByteFrequencyData(dataArray);

            var sum = dataArray.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            var average = sum / bufferLength;

            var normalizedAverage = average / 255;

            if (normalizedAverage > 0.25) {
            var skewValue = normalizedAverage * 60; 
            }
            else {
                var skewValue = normalizedAverage * -60; 
            }
            videoContainer.style.transform = 'skewX(' + skewValue + 'deg)';
        }


        // call functions
        function updateLoop() {
            updateBlur();
            updateColors();
            updatePlaybackSpeed();
            updateSkew();
            requestAnimationFrame(updateLoop);
        }

        updateLoop();
    }

    function handleUserInteraction() {
        if (!userHasInteracted) {
            initializeAudioContext();
            userHasInteracted = true;

            // start video playback after user interaction
            videoPlayer.play();
            sonicPiVideo.play();
        }
    }

    // Add a click event listener to the document
    document.addEventListener('click', handleUserInteraction);
});
