var stream;

function hasUserMedia() {
      //check if the browser supports the WebRTC 
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia);
}

if (hasUserMedia()) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia;

      //enabling video and audio channels 
      navigator.getUserMedia({ video: true, audio: true }, function (s) {
            stream = s;
            var video = document.querySelector('video');

            //inserting our stream to the video tag     
            video.src = window.URL.createObjectURL(stream);
      }, function (err) { });

} else {
      alert("WebRTC is not supported");
}

// getAudioTracks: Returns a list of the audio MediaStreamTrack objects from the MediaStream object
btnGetAudioTracks.addEventListener("click", function () {
      console.log("getAudioTracks", stream.getAudioTracks());
});

// getTrackById: Returns the track by ID. If the argument is empty or the ID is not found, it returns null. 
// If several tracks have the same ID, it returns the first one
btnGetTrackById.addEventListener("click", function () {
      console.log("getTrackById", stream.getTrackById(stream.getAudioTracks()[0].id));
});

// getTracks: Returns a list of all MediaStreamTrack objects from the MediaStream object.
btnGetTracks.addEventListener("click", function () {
      console.log("getTracks()", stream.getTracks());
});

// getVideoTracks: Returns a list of the video MediaStreamTrack objects from the MediaStream object
btnGetVideoTracks.addEventListener("click", function () {
      console.log("getVideoTracks()", stream.getVideoTracks());
});

btnRemoveAudioTrack.addEventListener("click", function () {
      console.log("removeAudioTrack()", stream.getAudioTracks()[0]);
});

btnRemoveVideoTrack.addEventListener("click", function () {
      console.log("removeVideoTrack()", stream.getVideoTracks()[0]);
});