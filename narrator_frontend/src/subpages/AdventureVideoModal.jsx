import React, { useState, useEffect } from 'react';

import VideoKeyFilter from '../adventurePage/VideoKeyFilter';
import VideoConcatenator from '../adventurePage/VideoConcatenator';
import ProgressIndicator from '../adventurePage/ProgressIndicator';

const AdventureVideoModal = ({title, formData, summary, additionalCharacters, nativeMediaRecorder, incrementUsage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('-');
  const [showStartCancelButtons, setShowStartCancelButtons] = useState(true);
  const [imageURLS, setImageURLS] = useState([]); // Modified to store an array of URLs
  const [videoSRC, setVideoSRC] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For slideshow
  const [progress,setProgress] = useState([false,false,false])
  const [usedTitle, setUsedTitle] = useState('')



useEffect(() => {
  setUsedTitle(title);
  if(summary.length<50){
    setMessage("WARNING: This game has a small summary, either by chance or due to NSFW. Video creation likely limited!")
  }
}, [])


// implicit hallucination styles:
let guessedHallucinationStyles;
if ((formData.guessHallucinationStyles === undefined || formData.guessHallucinationStyles)) {
 // console.log('attempting to set implicit styles')
  let keyValuePairs = []
  const extractFirstTenWords = (text) => {
      if (!text) return '';
      const words = text.split(/[\s,.!]+/);
      return words.slice(0, 10).join(' ');
  };
  
 // console.log("FORMDATA GENRE: ", formData.gametype);
  if (formData.gametype) {
    keyValuePairs.push({ key: 'implied_style', value: extractFirstTenWords(formData.gametype) });
  }
  if (formData.race1){
  //  console.log("FORMDATA RACE1: ", typeof formData.background1);
    keyValuePairs.push({ key: `you, ${formData.name1||''}`, value: (!formData.background1 || formData.background1.includes('(put your')) ? extractFirstTenWords(formData.race1 || '') : extractFirstTenWords(formData.background1 || '') });
   // console.log({ key: 'you', value: extractFirstTenWords(formData.background1) })
  }

  if (Array.isArray(additionalCharacters) && additionalCharacters.length > 0) {
    additionalCharacters.forEach(character => {
      if (character.name && character.role) {
        //console.log(character);
        keyValuePairs.push({ key: character.name.trim().split(' ')[0], value: 
          (character.description && (character.description==="a humanoid" || character.description.includes('(put your')))
          ? extractFirstTenWords(character.role || '') 
          : extractFirstTenWords(character.description ||'') });
      } 
    });
  }
  //console.log(keyValuePairs);
      guessedHallucinationStyles = keyValuePairs;
} else {
      guessedHallucinationStyles = null;
}
  function beginVideoGen(event) {
    //window.MediaRecorder = nativeMediaRecorder;
    event.stopPropagation();
    incrementUsage(); // charging
    setShowStartCancelButtons(false);
    setMessage("Creating Video. This may take 50s, please be patient.")
    makeRequestsAndChain(summary);
    console.log('Video gen requested');
  }


  function splitStringIntoLines(inputString) {
    // Split the string by new line
    let lines = inputString.split('\n');
    
    // Check if the lines are more than 10
    if (lines.length > 10) {
      // Take the first 9 lines as is
      let firstNine = lines.slice(0, 9);
      
      // Combine the rest into a single line
      let combinedLast = lines.slice(9).join(' ');
      
      // Update lines to contain only the first 9 and the combined last line
      lines = [...firstNine, combinedLast];
    }
    
    return lines;
  }

  useEffect(() => {
    //console.log(imageURLS); // This will log the updated state
  }, [imageURLS]);

async function makeRequestsAndChain(summary) {
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';
 // console.log('Starting first batch of requests');

  const storyboardResponses = await fetch(`${api_url}storyboard`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({prompt:summary})
  })
  setMessage("Key moments identified, now creating storyboard...")
  const storyboardResult = await storyboardResponses.json();
  setProgress([true,false,false]);
  //console.log(storyboardResult);
  const sentenceGroups = splitStringIntoLines(storyboardResult.image_set)
 // console.log("guesses for hallucinator: ", guessedHallucinationStyles)
  const firstBatchResponses = await Promise.all(sentenceGroups.map(group => {
    const requestBody = {
      prompt: VideoKeyFilter(group, formData.hallucinator,'', guessedHallucinationStyles).replace(/\r?\n/g, ", "),
      censorImages: false,
      negativePrompt: 'illustration, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, extra limbs, disfigured,  bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy, child, young, baby, son'
    };
 //   console.log(`Sending to fancyHallucinate: ${JSON.stringify(requestBody)}`);
    return fetch(`${api_url}fancyHallucinate`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }).then(response => response.json());
  }));
  //const imageUrls = firstBatchResponses.map(response => response.imageUrl);
  //console.log(firstBatchResponses);
  //setImageURLS(firstBatchResponses);
    
    setMessage("Storyboard built, now creating video... Almost done")
    setProgress([true,true,false]);
  //console.log('Starting second batch of requests');
  

  const secondBatchResponses = await Promise.all(firstBatchResponses.map(response => {
    const requestBody = {imageUrl: response.imageUrl};
    console.log(`Sending to recap: ${JSON.stringify(requestBody)}`);
    return fetch(`${api_url}recap`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    }).then(response => response.json());
  }));

 // console.log(imageURLS);
 // console.log('Concatenating videos');
  setProgress([true,true,true]);
  // Extract just the URLs in a simple array
  const videoUrls = secondBatchResponses.map(response => response.videoUrl);
  //console.log(videoUrls);
  //const finalVideo = await concatVideos(videoUrls);
  setVideoSRC(videoUrls);
  setMessage("Videos created. Play to enable download. Stay here while playing")
}

const handleTitleChange = (event) => {
  setUsedTitle(event.target.value);
};

if (!isOpen) {
  return <button type="button" className="startButton" style={{marginRight:'10px'}}onClick={()=>{setIsOpen(true)}}>Open Adventure Video</button>;
}
return (
    <div className="adventure-video" style={{ margin: 'auto' }}>
      <div className="adventure-video-content">
        <h1 style={{color:'#b4ecee'}}>Adventure Video Generator</h1>
        <p>This tool creates gestalt videos - it's still experimental, but I hope you like it!</p>
        <p>{message}</p>
        {!videoSRC && <> <label htmlFor="titleInput">Set your title:</label>
        <input
        style={{display:'inline', maxWidth:'300px'}}
        type="text"
        id="titleInput"
        value={usedTitle}
        onChange={handleTitleChange}
      /> </>}
        {!progress[2] && !showStartCancelButtons && <ProgressIndicator steps={progress} />}
        {false && imageURLS.length > 0 && !videoSRC && (
          <div className="image-slideshow">
            <img src={imageURLS[currentImageIndex]?.imageUrl} alt="Slideshow" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          </div>
        )}
        {videoSRC && (
          <VideoConcatenator title={usedTitle} videoSources={videoSRC} additionalVideoSource={'https://narrator-assets.s3.amazonaws.com/narrator_endcap2.mp4'} audioSource={'/audio/bg_tune.wav'} />
        )}
        {showStartCancelButtons && (
          <div>
            <button type="button" className="startButton" style={{marginRight: '10px'}} onClick={() => { beginVideoGen(event) }}>Create Video</button>
            <button type="button" className="startButton" onClick={() => { setIsOpen(false) }}>Cancel</button>
            
          </div>
        )}
      </div>
      <hr/>
    </div>
  );

};

export default AdventureVideoModal;
