import React, { useRef, useEffect, useState } from 'react';

const VideoConcatenator = ({ videoSources, additionalVideoSource, audioSource, title }) => {
  const videoRefs = useRef([]);
  const canvasRef = useRef(null);
  const audioRef = useRef(new Audio(audioSource)); // Reference for the audio
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [blobVideoSources, setBlobVideoSources] = useState([]);
  const [playbackStarted, setPlaybackStarted] = useState(false); // To control playback start


  const fetchAndConvertVideosToBlobs = async (sources) => {
    const blobUrls = await Promise.all(sources.map(async (src) => {
      const response = await fetch(src);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }));
    setBlobVideoSources(blobUrls);
    videoRefs.current = blobUrls.map(() => React.createRef());
  };


  useEffect(() => {
    const fetchAdditionalVideoAndConvertToBlob = async () => {
      const response = await fetch(additionalVideoSource);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    };

    fetchAndConvertVideosToBlobs(videoSources).then(() => {
      fetchAdditionalVideoAndConvertToBlob().then(additionalBlobUrl => {
        setBlobVideoSources(prev => [...prev, additionalBlobUrl]);
        videoRefs.current = [...videoRefs.current, React.createRef()];
      });
    });
  }, [videoSources, additionalVideoSource]);

  useEffect(() => {
    audioRef.current.addEventListener('ended', () => audioRef.current.pause()); // Cleanup on audio end
    return () => {
      audioRef.current.removeEventListener('ended', () => audioRef.current.pause());
    };
  }, []);

  const startAudio = () => {
    audioRef.current.volume = 0.1; // Start with low volume for fade in
    audioRef.current.play();
    let volume = 0.1;
    const fadeAudioIn = setInterval(() => {
      if (volume < 1) {
        volume += 0.1;
        audioRef.current.volume = Math.min(volume,1.0);
      } else {
        clearInterval(fadeAudioIn);
      }
    }, 200); // Increase volume gradually
  };

  const stopAudio = () => {
    let volume = audioRef.current.volume;
    const fadeAudioOut = setInterval(() => {
      if (volume > 0.1) {
        volume -= 0.1;
        audioRef.current.volume = volume;
      } else {
        clearInterval(fadeAudioOut);
        audioRef.current.pause();
      }
    }, 200); // Decrease volume gradually
  };

  let gradientOffset = 0;
  let animationFrameId;

  const drawIntroScreen = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas for the animation
  
    // Set the background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    // Set font style
    ctx.font = '48px "Impact", sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
  
    // Create a dynamic gradient
    let gradient = ctx.createLinearGradient(gradientOffset, 0, 300 + gradientOffset, 0);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.5, '#b4ecee');
    gradient.addColorStop(1, '#007a7a');
    ctx.fillStyle = gradient;
  
    // Update the gradient offset for the next frame
    gradientOffset += 5; // Adjust the speed of the gradient movement
    if (gradientOffset > canvasRef.current.width) gradientOffset = -300;
  
    // Add text shadow for a cool effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 7;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  
    // Draw the text with the dynamic gradient
    ctx.fillText(title, canvasRef.current.width / 2, canvasRef.current.height / 2);
  
    // Continue the animation
    animationFrameId = requestAnimationFrame(drawIntroScreen);
  };
  

  const playVideoAtIndex = async (index) => {
    if (index === 0) {
      // Draw intro screen before the first video
      startAudio(); // Start playing audio with fade in
    }
    if (index < blobVideoSources.length) {
      const videoElement = videoRefs.current[index].current;
      videoElement.play();
      drawVideoFrame(videoElement);
      videoElement.onended = () => {
        playVideoAtIndex(index + 1);
      };
    } else {
      stopRecording();
      stopAudio(); // Stop audio with fade out when all videos have been played
    }
  };

  const handlePlayClick = () => {
    if (!playbackStarted) {
      setPlaybackStarted(true);
      if (mediaRecorder) {
        drawIntroScreen();
        startRecording();
        setTimeout(function() {
          cancelAnimationFrame(animationFrameId);
          playVideoAtIndex(0);
        }, 1500)
      }
    }
  };

  const drawVideoFrame = (videoElement) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasRef.current.width, canvasRef.current.height);
    requestAnimationFrame(() => {
      if (!videoElement.paused && !videoElement.ended) {
        drawVideoFrame(videoElement);
      }
    });
  };


  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const setupRecording = () => {
    // Capture the stream from the canvas
    const videoStream = canvasRef.current.captureStream(10); // Match the FPS
  
    // New - Setup to capture audio
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioRef.current);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    // Connect the audio source to the destination to play audio through speakers as well
    source.connect(audioContext.destination);
  
    // Combine the video and audio streams
    const tracks = [...videoStream.getTracks(), ...destination.stream.getTracks()];
    const combinedStream = new MediaStream(tracks);
  
    const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp8,opus' });
    recorder.ondataavailable = handleDataAvailable;
    recorder.onstop = () => {
      setIsRecordingComplete(true);
      stopAudio(); // Ensure audio is stopped and faded out when recording stops
      audioContext.close(); // Clean up the audio context
    };
    if (typeof recorder.pause === 'function' && typeof recorder.resume === 'function') {
      recorder.onpause = () => console.log('Recording paused');
      recorder.onresume = () => console.log('Recording resumed');
    }

    setMediaRecorder(recorder);
  };
  

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start(1000); // Optional: Slice the recording into chunks of 1 second
      setIsRecording(true);
      console.log('Recording started');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('recorder stopped')
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (blobVideoSources.length === videoSources.length) {
      // Ensure that the recording setup and title drawing occur in sequence
      const prepareAndStart = async () => {
        //await drawIntroScreen(); // Wait for the intro screen to be drawn
        setupRecording(); // Then set up the recording
      };
  
      prepareAndStart();
    }
  }, [blobVideoSources]); // Depend on blobVideoSources being set
  
 
  const downloadRecordedVideo = () => {
    if (recordedChunks.length > 0 && isRecordingComplete) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'narrator_vid.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      if(recordedChunks) console.log(recordedChunks.length);
      console.log('Recording not complete or no recorded chunks available');
    }
  };
  const resetAndPlayAgain = () => {
    audioRef.current.currentTime = 0;
    setPlaybackStarted(false); // Reset to allow playback to start again
    setTimeout(() => {
      startAudio();
      playVideoAtIndex(0);
      //handlePlayClick(); // Directly invoke play handling to restart video playback
    }, 0); // Timeout ensures state is updated before attempting to play again
  };

  useEffect(() => {
    // Function to check if any video is playing
    const isAnyVideoPlaying = () => {
      return videoRefs.current.some(ref => ref.current && !ref.current.paused && !ref.current.ended);
    };
  
    // Pause recording if tab is inactive or all videos are paused
    const handleVisibilityChange = () => {
      if (document.hidden || !isAnyVideoPlaying()) {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.pause(); // Pause recording
          console.log('Recording paused');
        }
      } else {
        if (mediaRecorder && mediaRecorder.state === 'paused') {
          mediaRecorder.resume(); // Resume recording
          console.log('Recording resumed');
        }
      }
    };
  
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mediaRecorder]); // Add mediaRecorder as a dependency


  return (
    <div>
      {blobVideoSources.map((src, index) => (
        <video key={index} ref={videoRefs.current[index]} src={src} style={{ display: 'none' }} muted playsInline />
      ))}
      <canvas ref={canvasRef} width="768" height="512"
            style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain', // This ensures the aspect ratio is preserved
        display: 'block', // Ensures the canvas does not have extra space below it
        margin: 'auto' // Centers the canvas if its display size is smaller than its parent
      }} onClick={handlePlayClick} />
      {(!playbackStarted) && !isRecordingComplete && <button type="button" className="startButton" onClick={handlePlayClick}>Play</button>}
      {isRecordingComplete && <button onClick={resetAndPlayAgain} type='button' className="startButton">Play Again</button>
}
      <button onClick={downloadRecordedVideo} type='button' className="startButton" style={{marginLeft: '10px', background: !isRecordingComplete ? 'grey' :'' }} disabled={!isRecordingComplete}>Download Video</button>
    
    </div>
  );
};
export default VideoConcatenator;