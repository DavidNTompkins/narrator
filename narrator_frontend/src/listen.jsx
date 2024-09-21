import {nanoid}  from "nanoid";
import {react, useState} from "react";
import generatePrimaryPrompt from './smallScripts/PromptGenerator.js'
//import speak_local from "./speak_local.jsx"
const listen = (dialogue,messages, setMessages,handler, setHandler,setStatus,hyperionFlag,hyperionSummary,setHyperionFlag, formData,textlog, setTextlog,editableTextlog, setEditableTextlog,keyboard,additionalCharacters,bakedCharacters,useBaked) => {
  //var File = require("file-class");
  var recorder = null;
  var chunks = [];
  var result = null;
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  
  const handleKeyDown = (event) => {
    if (keyboard.current) {
      document.removeEventListener('keydown', null);
      document.removeEventListener('keyup', null);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if(status=="waiting"){setStatus("reading")}
    } else if (((!recorder) && (status!='speaking')) && (event.code === 'Space' ||event.type =="touchstart")) {
      console.log(keyboard.current)
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setStatus('listening')
          recorder = new MediaRecorder(stream, {mimetype: "audio/wav"});
          recorder.addEventListener('dataavailable', async (event) => {
            chunks.push(event.data);
            console.log("chunks pushed");

        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        if (!(audioBlob.size > 10000)){ // this needs better handling.
          console.log('no audio here');
          chunks = [];
          recorder = null;
          //speak_local("Apologies, no audio was detected. Please try again.")
        } else{
          setStatus('thinking')
        console.log('Audio blob size:', audioBlob.size);
        // audio.play();
        const formData_audio = new FormData();
        const fileName = nanoid()
        const newfile = new File([audioBlob], `${fileName}.wav`, { type: 'audio/wav' });
        formData_audio.append('file',newfile)
        //formData.append('audio', audioBlob, 'audio.mp3');
        const response = await fetch(`${api_url}endpoint3`, {
          method: 'POST',
          //headers: {
            //"Content-Type": "audio/mp3"
          //},
          body: formData_audio
        })
          //.then(response => console.log(response))
          //.catch(error => console.error(error));
        console.log(response)
        result = await response.json()
        console.log(result)
          const temptextlogString = editableTextlog.current
            setTextlog((prevText) => prevText +`${temptextlogString}`);
            setEditableTextlog("");
          
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        document.getElementById("avatars").removeEventListener("touchstart", handleKeyDown);
        document.getElementById("avatars").removeEventListener("touchend", handleKeyUp);
        recorder = null;
        chunks = [];
        //waiting = false;
          /*if(result.text =="" || result.text == "You"){
            return("");
          }*/
          if(messages.length >= 16){
           // console.log("setting hyperion message")
            const hSummary = await hyperionSummary;
            const starterPrompt = generatePrimaryPrompt(formData, additionalCharacters,bakedCharacters,useBaked,rules,'Ask the player what they do in each decision.'); 
             /* `Please act as a text-based ${formData.gametype} role playing game simulator. Follow these rules:
              1. Address the player as 'you' 
              2. Stay in character. 
              3. Be brief. Responses should be one paragraph at most.
              4. Game mechanics are decided by you. No dice are rolled.
              5. Battle takes multiple turns.
              6. The player decides what their character would do. 
              7. Use dialogue and emotion in accordance with the creative writing technique: show don't tell.
              The player is:
              ${formData.name1} - ${formData.race1} - ${formData.class1}
              Additionally the player has a companion:
              ${formData.name2} - ${formData.race2} - ${formData.class2} (DM Controlled)
              Ask the player what they do in each decision.
              `*/
            await setMessages([{ role: "system", content: starterPrompt }, { role: "system", content: `Game resume. Summary of game so far: ${hSummary}` }, {role: "assistant", content: editableTextlog.current}, { role: "user", content: result.text }])
            console.log(messages)
            //console.log("Hyperion Message Set")
            setTextlog((prevText) => prevText +`\n---\n<strong>${formData.name1}(you):</strong> `+result.text +`\n---\n`)
            setHandler(handler +1);
            return(result.text);
          } else {
            const newMessages = [...messages];
            var newPrimaryPrompt = generatePrimaryPrompt(formData,additionalCharacters,bakedCharacters,useBaked,rules,'Ask the player what they do in each decision.');
            newMessages[0] = {role: "system", content:newPrimaryPrompt};
            
        //was ...messages
        setMessages([...newMessages,{role: "assistant", content: editableTextlog.current}, { role: "user", content: result.text }] )
            
            setTextlog((prevText) => prevText +`\n---\n<strong>${formData.name1}(you):</strong> `+result.text +`\n---\n`)
            
        setHandler(handler + 1)
        return(result.text)
          }
        }
      });
          recorder.start();
          console.log('recorder created')
        })
        .catch(error => console.error(error));
    } else {console.log("keydownskipped")}
  };

  const handleKeyUp = (event) => {
    if (recorder && (event.code === 'Space' || event.type =="touchend")) {
      
      //console.log("in key up logic")
      
      recorder.stop();
      recorder.stream.getTracks().forEach(i => i.stop())
      //console.log('after onstop logic')
      recorder = false
      
    }
  };
  //var waiting = true;
  //console.log("adding listeners") // bonus removal to handle occasional bug.
 document.getElementById("avatars").removeEventListener("touchstart", null);
  document.getElementById("avatars").removeEventListener("touchend", null);
  document.removeEventListener('keydown', null);
  document.removeEventListener('keyup', null);
  document.getElementById("avatars").addEventListener("touchstart", handleKeyDown);
  document.getElementById("avatars").addEventListener("touchend", handleKeyUp);

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  //document.addEventListener('mousedown', handleKeyDown);
  //document.addEventListener('mouseup', handleKeyUp);
  
};

export default listen;