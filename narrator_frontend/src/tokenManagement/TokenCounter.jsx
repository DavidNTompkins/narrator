import {React, useState} from 'react';
import {encode} from '@nem035/gpt-3-encoder';
import generatePrimaryPrompt from '../smallScripts/PromptGenerator.js'

const TokenCounter = ({formData, messages, editableTextlog, additionalCharacters,tokenFlag, setTokenFlag, setUseBaked, hyperionNeeded, setHyperionNeeded, bakedCharacters}) => {
  
      const turnCount = messages.length/2;
      const rules = formData.rules ? formData.rules : ""
      let trimmedMessages = messages;
      let bakerEnabled = localStorage.getItem('baker') ? localStorage.getItem('baker')==='true' : true;
      const PrimaryString = generatePrimaryPrompt(formData, additionalCharacters,"",false);
     let messageTexts = messages
  .map(message => message.content)
  .slice(1) // Exclude the first element
  .join(' ');
  
      let fullMessage = PrimaryString + ' ' + messageTexts + ' ' + editableTextlog;
      const messageLength = encode(messageTexts).length;
      const mostRecentMessageLength = encode(editableTextlog).length;
      const primaryPromptLength = encode(PrimaryString).length;
      const encodedLength = messageLength + mostRecentMessageLength + primaryPromptLength;

      const estimatedTurnLength = (messages.length>2) ? messageLength/(messages.length-2) : 1;
      const estimatedMaxTokenCount = encodedLength + estimatedTurnLength * 1.1 * (16-messages.length);
  if (messages.length > 2){
  if(bakerEnabled){
      if ((!tokenFlag && estimatedMaxTokenCount>3800) || primaryPromptLength>1500){
        console.log('estimatedMaxTokenCount: ',estimatedMaxTokenCount);
        console.log('primaryPromptLength: ', primaryPromptLength)
        setTokenFlag(true);
      console.log('Baker engaged!');
      }
  }
      if (tokenFlag && estimatedMaxTokenCount<=3800 && (primaryPromptLength<=1500)){
        setTokenFlag(false);
        console.log('Baker disengaged');
      }
  if(bakerEnabled){ 
    
      if((encodedLength + (4.1 * estimatedTurnLength)>4000)){
        
       setUseBaked(true); 
        const bakedString = generatePrimaryPrompt(formData, additionalCharacters,bakedCharacters,true,rules)
        if(encode(bakedString).length + messageLength + mostRecentMessageLength + 6.2*estimatedTurnLength >4000){
          // i.e. if we're going to hit the wall even after baking, refire those hyperions.
          setHyperionNeeded(true);
          console.log("early hyperion triggered") // this is triggering, but not working. 
        }else{setHyperionNeeded(false)}
        console.log('user bakedsummary active')
      } else {
        setHyperionNeeded(false);
        setUseBaked(false);
        console.log('not using bakedsummary')
      }
  }
  }

      
    
  return (
    <div className="token-counter" style={{ 
      color: 'gray', 
      visibility: !bakerEnabled ? 'visible' : 'hidden'
    }}>
        <p>Baker disabled</p>
      <p> Token usage:</p>
      <p>{encodedLength} / 4096 tokens</p>
      {(turnCount==8) ? <p>Shrinks this turn</p>:
      <p>Shrinks in {8-turnCount} turn(s)</p>}
    </div>
  );
}

export default TokenCounter;
