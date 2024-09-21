import {useRef,useState} from 'react'
import {utterances} from './smallScripts/utterances.js';
import hallucinatorFilter from './hallucinator/hallucinatorFilter.jsx';
async function speak_local(messages,voice,setStatus,browser,textlog,setTextlog,editableTextlog,setEditableTextlog,keyboard,speaker,msgCount,utterancesRef,timeoutIdsRef,addImage,hallucinatorKeys,hallucinationOn,censorImages,guessedHallucinationStyles,priorMessage='') {
  const imagePromise = fetchImageForMessage(hallucinatorFilter(messages,hallucinatorKeys,priorMessage,guessedHallucinationStyles),hallucinationOn,censorImages);
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  if (!speaker.current){
    const timeout = 100+(700*msgCount)
    //console.log(timeout);
    //fetchImageForMessage()
    const timeoutId = setTimeout(() => {
      
      (async () => {
        if(hallucinationOn){
          const image = await imagePromise;
          if (image) {
                //console.log('image url ', image);
                  addImage(image.imageUrl);
          }
        }  
      })();
      
        timeoutIdsRef.current = timeoutIdsRef.current.filter(id => id !== timeoutId);
      setEditableTextlog(prevText => prevText + messages);
      
 
}, timeout);
    timeoutIdsRef.current.push(timeoutId);
    //console.log('timmeoutIDs count: ', timeoutIdsRef.current.length)
    if(keyboard.current){
        setStatus('reading')
        document.getElementById("keyboard-input").focus();
      }else {
        if(browser!="safari"){setStatus('waiting');}
      }
  } else {
    utterancesRef.current.push(messages);
  setStatus("speaking")
  const synth = window.speechSynthesis;
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}]/gu;
    
  const maxLength = 150;
  const messageParts = splitLongMessage(messages.replace(emojiRegex,''), maxLength);

  messageParts.forEach((part) => {
   
    const utterance = new SpeechSynthesisUtterance(part);
  var voiceSettings = {};
  if(browser=="safari"){setEditableTextlog((prevText) => prevText + part);}
  switch(browser) {
    case 'chrome':
      voiceSettings.rate = localStorage.getItem('rate') ? localStorage.getItem('rate') : 1.1;
      voiceSettings.pitch = localStorage.getItem('pitch') ? localStorage.getItem('pitch') : 1;
      break;
        case 'firefox':
      voiceSettings.rate = localStorage.getItem('rate') ? localStorage.getItem('rate') : 0.9;
      voiceSettings.pitch = localStorage.getItem('pitch') ? localStorage.getItem('pitch') : 1.1;
      break;
        case 'safari':
      voiceSettings.rate=localStorage.getItem('rate') ? localStorage.getItem('rate') : 1;
      voiceSettings.pitch=localStorage.getItem('pitch') ? localStorage.getItem('pitch') : 1;
    default:
      voiceSettings.rate = localStorage.getItem('rate') ? localStorage.getItem('rate') : 1;
      voiceSettings.pitch = localStorage.getItem('pitch') ? localStorage.getItem('pitch') : 1;
  }
  
// Set the voice of the utterance
  utterance.voice = voice;
  utterance.rate = voiceSettings.rate;
  utterance.pitch = voiceSettings.pitch;
  
  utterance.onstart = () => {
    
    if(true){
      (async () => {
        if(hallucinationOn){
          const image = await imagePromise;
          if (image) {
                  addImage(image.imageUrl);
          }
        }
      })();
      setEditableTextlog((prevText) => prevText + part);
      utterancesRef.current.shift();
    }
  }
  utterance.onend = (event) => {
    if (!synth.pending){
      if(keyboard.current){
        setStatus('reading')
        document.getElementById("keyboard-input").focus();
      }else {
        if(browser!="safari"){setStatus('waiting');}
      }
    }
  }
  //utterance1.voice = "Google UK English Male"
  utterances.push( utterance );
  synth.speak(utterance);
  })
  //synth.speak(utterance)
}
}

// Functions follow

async function fetchImageForMessage(message, hallucinationOn,censorImages) {
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  if(hallucinationOn && message !='' && message.length >= 8){
    //console.log('going with halluc',hallucinationOn);
    try { //https://narratorbackend.davidtompkins3.repl.co
        const response = await fetch(`${api_url}hallucinate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message.replace(/\r?\n/g, ", "),
                                  censorImages: (censorImages !== undefined) ? censorImages : true,
                                  negativePrompt: censorImages ? 'ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame,shutterstock, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy, child, young, baby, son, daughter, nude, sex, nsfw, porn, breast, tits, ass, dick' : 'ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame,shutterstock, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy, child, young, baby, son, daughter, teen' }),
        });
      const data = await response.json();
          return data; // Return the image URL or data
      } catch (error) {
          console.error('Error fetching image:', error);
          return null;
      }
  } else{
    console.log('no halluc ', hallucinationOn);
    return null;
  }
}

function splitLongMessage(msg, maxLength) {
  if (msg.length <= maxLength) return [msg];

  const splitRegex = /(\, |; |\n|\r)/g; // Include delimiters in the result
  let parts = [];
  let currentPart = '';

  msg.split(splitRegex).forEach(segment => {
    if (currentPart.length + segment.length > maxLength) {
      // If currentPart is not empty, push it to parts and reset
      if (currentPart.length > 0) {
        parts.push(currentPart);
        currentPart = '';
      }

      // If segment is too long, split it further
      while (segment.length > maxLength) {
        let breakPoint = segment.lastIndexOf(' ', maxLength);
        if (breakPoint === -1) {
          breakPoint = maxLength;
        } else {
          // Append a space after a break made on a space
          breakPoint += 1;
        }
        parts.push(segment.substring(0, breakPoint));
        segment = segment.substring(breakPoint).trim();
      }
      currentPart = segment;
    } else {
      currentPart += segment;
    }
  });

  // Add any remaining part
  if (currentPart) parts.push(currentPart);
  return parts;
}




export default speak_local