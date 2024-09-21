//import speak from "./speak.jsx"
import speak_local from "./speak_local.jsx";
import speak from './speak.jsx';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {useRef,useState} from 'react';

async function chatHandler(messages,setMessages,formData, audioQueue, qLength, setStatus,browser,textlog,setTextlog,editableTextlog, setEditableTextlog,keyboard,speaker,utterancesRef,user,handler,location, abortController,setAbortController,isStreamActive,setIsStreamActive,timeoutIdsRef,addImage,hallucinationOn,guessedHallucinationStyles) {
  //console.log("Sending: " + messages)
  var fullMessage = ""
  document.removeEventListener('keydown', null);
  document.removeEventListener('keyup', null);
  document.removeEventListener("touchstart", null);
  document.removeEventListener("touchend", null);
  //const synth = window.speechSynthesis;
  console.log('chathandling')
  setIsStreamActive(true);
  // some hallucincation bits:
  var priorMessage = '';


  const userID = user ? user.uid : "NotLoggedIn";
  const originPage = (location.pathname === '/') ? 'explore' : 'notExplore'
  console.log(originPage);
  let isConnected = false;
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';


  const voice = await getVoice(browser);
  //console.log(voice.name)
  console.log('making chat request')
  if (userID=="NotLoggedIn") {
    // this isn't being used rn, but could be used to limit anonymous play easily. Handler is # of messages deep (i think including rerolls)
    //console.log(handler);
  }
  // cleans up old abortcontroller (this is really just in case something went wrong)
  if (abortController) {
    abortController.abort();
    console.log('Previous stream aborted');
  }
  // checking moderation 
  const lastMessage = "The following is a line of dialogue from a roleplaying game: " + messages[messages.length - 1].content
  console.log(lastMessage);
  const moderation = await fetch(`${api_url}moderation`,{

  method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({lastMessage,userID}),
  })
        const result = await moderation.json()
        //console.log('here2')
        if(result.code =="good" || user){
   let curRequestController = new AbortController();
          setAbortController(curRequestController); // Set the AbortController in state

  var msgCount = 0;
          console.log("SENDING MESSAGE");
  const response = await fetchEventSource(`${api_url}stream2`, {
    openWhenHidden:true,
    signal: curRequestController.signal,
    method: "POST",
    credentials: 'include', 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      messages, 
      userID, 
      originPage, 
      model:formData.model,
      temperature: formData.temperature !== undefined ? formData.temperature : 0.8,
      frequency_penalty: formData.frequency_penalty !== undefined ? formData.frequency_penalty : 0.2,
      repetition_penalty: formData.repetition_penalty !== undefined ? formData.repetition_penalty : 0.8,
      presence_penalty: formData.presence_penalty !== undefined ? formData.presence_penalty : 0.2,
    }),
        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
            isConnected = true; // Set the flag to true when the connection is open

           } else if (res.status === 403) {
            console.log("Forbidden: Error 403");
            res.text().then(errorMessage => {
              setEditableTextlog(prevLog => prevLog + errorMessage + "\n\n");
              fullMessage = errorMessage;
              speak_local(fullMessage, voice, setStatus, browser, textlog, setTextlog, editableTextlog, setEditableTextlog, keyboard, speaker, msgCount, utterancesRef, timeoutIdsRef, addImage, formData?.hallucinator, hallucinationOn, guessedHallucinationStyles);
            }).catch(error => {
              console.error("Error reading 403 response:", error);
              const fallbackMessage = "Error 403: Access forbidden. This message was auto-rejected for sensitive content."
              //setEditableTextlog(prevLog => prevLog + fallbackMessage + "\n\n");
              fullMessage = fallbackMessage;
              speak_local(fullMessage, voice, setStatus, browser, textlog, setTextlog, editableTextlog, setEditableTextlog, keyboard, speaker, msgCount, utterancesRef, timeoutIdsRef, addImage, formData?.hallucinator, hallucinationOn, guessedHallucinationStyles);
            });
            curRequestController.abort();
            setIsStreamActive(false);
          }
        else if (res.status === 429) {
            console.log("daily interaction limit hit");
            fullMessage=`You've used your daily interactions. Sign up for Gold ($9.99/month), Silver($3.99/month), or come back tomorrow.`;
              setTextlog(textlog+ `<a href="https://playnarrator.com/plans">See plans and details here</a>\n\n`);
            speak_local(fullMessage, voice,setStatus,browser,textlog,setTextlog,editableTextlog, setEditableTextlog,keyboard,speaker,msgCount,utterancesRef, timeoutIdsRef, addImage, formData?.hallucinator,hallucinationOn,guessedHallucinationStyles);
              return fullMessage;
            } else if (res.status === 430) {
            fullMessage= `You've used all the free interactions on this account. Sign up to keep playing.`
            speak_local(fullMessage, voice,setStatus,browser,textlog,setTextlog,editableTextlog, setEditableTextlog,keyboard,speaker,msgCount,utterancesRef, timeoutIdsRef, addImage, formData?.hallucinator,hallucinationOn,guessedHallucinationStyles);
              setTextlog(textlog+ `<a href="https://playnarrator.com/plans">See plans and details here</a>\n\n`);
            //speak_local
              return fullMessage;
            } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          console.log(event)
          if ((event.data == ':close')|(event.data=="")) {
            curRequestController.abort();
            abortController.abort();
            console.log("ayo");
            setIsStreamActive(false); 
            return fullMessage;
          //self.close();
          } else {
         // console.log(event.data);
          const preparsedData = JSON.parse(event.data.replace(/\\\\/g, '\\'));
            
          const parsedData = preparsedData.replace(/^DM:/i, '').replace(/[\n\r]+#+/g, '').replace(/(\n{2,})/g, '\n\n');
          //console.log(parsedData +" : " + Date.now())
          fullMessage += parsedData;
          if(voice!="neets"){
          speak_local(parsedData, voice,setStatus,browser,textlog,setTextlog,editableTextlog, setEditableTextlog,keyboard,speaker,msgCount,utterancesRef,timeoutIdsRef,addImage, formData?.hallucinator,hallucinationOn,formData?.censorImages,guessedHallucinationStyles,priorMessage)
            priorMessage=parsedData;
          } else{
          speak(parsedData,audioQueue,qLength)
          }
            msgCount += 1;
          //speak(parsedData,audioQueue,qLength)
          //setData((data) => [...data, parsedData]);
          }
        },
        onclose() {
          console.log("Connection closed by the server");
          setIsStreamActive(false); // Stream is no longer active

          //console.log("")
          //return fullMessage
        },
        onerror(err) {
          console.log("There was an error from server", err);
          setIsStreamActive(false); // Stream is no longer active

          isConnected = false; // Clear the flag if there's an error

        },
      });
          } else if (result.code=="banned") {
          fullMessage = "This IP Address has been banned. If you think you are getting this in error, please email david@playnarrator.com or ask about it on discord. I also manually review these within about 24 hours."
          speak_local(fullMessage, voice,setStatus,browser,textlog,setTextlog,editableTextlog, setEditableTextlog,keyboard,speaker,msgCount,utterancesRef,timeoutIdsRef); 
        } else{
          fullMessage = user ? "This message was flagged or banned by the AI. Review your content and try again." : "This message was flagged or you are banned. Log in to use reduced filters, or email david@playnarrator.com if you think you're banned.";
          speak_local(fullMessage, voice,setStatus,browser,textlog,setTextlog,editableTextlog, setEditableTextlog,keyboard,speaker,msgCount,utterancesRef, timeoutIdsRef);        
  }
//console.log(fullMessage)
  if(browser=="safari"){
    if(keyboard.current){
      setStatus('reading')
    }else {setStatus('waiting');}
  }
  
return fullMessage
}

function getVoice(browser) {
  return new Promise((resolve, reject) => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    var voiceName = "";
    if (localStorage.getItem('voice')){
       voiceName = localStorage.getItem('voice');
     /* if(voiceName=="neets"){
        resolve("neets");
      } */
      if(voiceName=="Kiki-Custom"){
        resolve("Kiki-Custom");
      }
  } else {
    switch(browser) {
    case 'chrome':
      voiceName = 'Google UK English Male';
        console.log("chrome");
        break;
        case 'firefox':
      voiceName = 'Daniel';
        console.log("fireFox");
        break;
        case 'safari':
      voiceName = '';
        break;
    default:
      voiceName = 'Google UK English Male';
  }
  }
    
    if (voices.length) {
       resolve(voices.find((voice) => voice.name === voiceName));
      return;
    }
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      resolve(voices.find((voice) => voice.name === voiceName));
    };
  });
}

async function speak_kiki(messages,audioQueue,qLength) {
  qLength.current = qLength.current + 1
  const myIndex = qLength.current;
  console.log("attempting to say: " + messages)
  const response = await fetch(`${api_url}endpoint4`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages }),
  });
  const audioData = await response.arrayBuffer();
  audioQueue.add(audioData,myIndex);

}

export default chatHandler