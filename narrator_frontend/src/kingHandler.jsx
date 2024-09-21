// this handles the other handlers. 
import chatHandler from "./chatHandler.jsx"
import speak from "./speak.jsx"
import listen from "./listen.jsx"
import React, { useEffect, useRef, useState } from "react";
import hyperion from "./hyperion.jsx"
import generatePrimaryPrompt from './smallScripts/PromptGenerator.js'


async function kingHandler(messages, setMessages, handler,setHandler,audioQueue, qLength, setStatus, browser,hyperionFlag,setHyperionFlag, formData,textlog,setTextlog,editableTextlog,setEditableTextlog,keyboard,speaker,hyperionSummary,setHyperionSummary,user,save,adventureID,utterancesRef,imageData,setImageData,additionalCharacters,bakedCharacters,useBaked, hyperionNeeded, setHyperionNeeded,location, abortController,setAbortController, isStreamActive,setIsStreamActive,timeoutIdsRef,addImage,hallucinationOn) {

// implicit hallucination styles:
  let guessedHallucinationStyles;
  if ((formData.guessHallucinationStyles === undefined || formData.guessHallucinationStyles) && hallucinationOn) {
    console.log('attempting to set implicit styles')
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
      //console.log("FORMDATA RACE1: ", typeof formData.background1);
      keyValuePairs.push({ key: `you, ${formData.name1||''}`, value: (!formData.background1 || formData.background1.includes('(put your')) ? extractFirstTenWords(formData.race1 || '') : extractFirstTenWords(formData.background1 || '') });
     // console.log({ key: 'you', value: extractFirstTenWords(formData.background1) })
    }

    if (Array.isArray(additionalCharacters) && additionalCharacters.length > 0) {
      additionalCharacters.forEach(character => {
        if (character.name && character.role) {
          console.log(character);
          keyValuePairs.push({ key: character.name.split(' ')[0], value: 
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

  
  // this handles hyperion solving
 var tempHyperionSummary;
  console.log(hyperionNeeded);
  if(messages.length >= 16 || hyperionNeeded.current){ // will need to reduce eventually for cost
    setHyperionFlag(true);
    console.log("In hyperion handler");
    console.log(messages.length);
    tempHyperionSummary = hyperion(messages,setHyperionFlag,user,save,formData,adventureID,imageData,setImageData,additionalCharacters,textlog,true,setHyperionNeeded,hyperionSummary,"",bakedCharacters); //editabletextlog is by definition "" here. This avoids weird collisiony error
    setHyperionSummary(tempHyperionSummary);
    console.log(hyperionSummary);
    
  }
  const dialogue = await chatHandler(messages, setMessages,formData, audioQueue, qLength, setStatus,browser,textlog,setTextlog,editableTextlog,  setEditableTextlog,keyboard,speaker,utterancesRef,user,handler,location,abortController,setAbortController, isStreamActive,setIsStreamActive,timeoutIdsRef,addImage,hallucinationOn,guessedHallucinationStyles);
  
  console.log(dialogue)
    setIsStreamActive(false); 
  //setMessages([...messages,{role: "assistant", content: dialogue}]) // this only triggers properly on typing? source of jank - moved to subtitles
  console.log(messages)
  
  var userMsg = await listen(dialogue,messages, setMessages,handler, setHandler,setStatus,hyperionFlag,hyperionSummary,setHyperionFlag, formData,textlog,setTextlog,editableTextlog,
  setEditableTextlog,keyboard,additionalCharacters,bakedCharacters,useBaked);

  setHyperionFlag(false);

  /*while (userMsg == ""){
    console.log("Empty speech detected.")
    speak_local("I'm sorry, no audio was detected. Please try again. If you are on desktop, hold the spacebar until you are done speaking.",voice,setStatus,browser)
    userMsg = await listen(dialogue, messages, setMessages,handler, setHandler,setStatus);
  } */
  //console.log("Back from listener")
  
  //console.log(messages)
  
  //console.log(newMessage)
  // start over with new messages
  // kingHandler(newData);

}

export default kingHandler