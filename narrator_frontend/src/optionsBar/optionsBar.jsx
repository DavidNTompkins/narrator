import React from 'react';
import {FaBook, FaMicrophone, FaRegSave} from 'react-icons/fa'
import {GiSpeaker} from 'react-icons/gi'
import InstructionButton from '../instructionButton.jsx'
import ShareButton from '../shareButton.jsx'
import { v4 as uuidv4 } from 'uuid';
import saveOrUpdateAdventure from '../adventure'
import hyperion from '../hyperion'
import PublishButton from './PublishButton'
import ShareLinkButton from './ShareLinkButton'
import SpeechSettingsButton from '../smallScripts/speechSettingsModal'
import sayAWord from '../smallScripts/sayAWord.js';
import { useSubscription } from '../subpages/AccountPageItems/SubscriptionContext.jsx';



function OptionsBar({
  transVisible,
  setTransVisible,
  formData,
  id,
  setID,
  mobile,
  keyboard, 
  setKeyboard,
  status,
  setStatus, 
  user, 
  adventureID, 
  setAdventureID,
  auth,
  provider,
  imageData, 
  isPublished,
  setIsPublished,
  speaker,
  setSpeaker,
  utterancesRef,
  textlog,
  setTextlog,
  editableTextlog, 
  setEditableTextlog,
  additionalCharacters,
  browser,
  customRules,
  setCustomRules,
  setModelSelection,
  modelOptions,
  setRules,
  setFormData,
  onExplorePage,
  editingExistingGame, 
  existingGamePacket}) {

    const { hasSubscription, subscriptionType } = useSubscription();


  return (
    <div className="OptionsBar">
      <div className="OptionsButtonDiv">
        {user && <div className="OptionsButton">
          
        <SpeechSettingsButton customRules={customRules} setCustomRules={setCustomRules} setModelSelection={setModelSelection} modelOptions={modelOptions} setRules={setRules} formData={formData} setFormData={setFormData} />
          </div>}         
        
        {browser!="safari" && <div className="OptionsButton" style={{color: speaker.current ? null:'gray'}} onClick={() => {
      if(speaker.current==true){
        // this breaks ongoing conversation but something like it might be able to fix longstanding audio bug.
        const synth = window.speechSynthesis;
        synth.cancel();
        while (utterancesRef.current.length > 0) {
        const item = utterancesRef.current[0];
        setEditableTextlog((prevText) => prevText + item);
         utterancesRef.current.shift();
          }
        if(keyboard.current){
        setStatus('reading')
        document.getElementById("keyboard-input").focus();
      }else {
        if(browser!="safari"){setStatus('waiting');}
      }
        if(speaker.current){localStorage.setItem('audioOn', 'false')}else{localStorage.setItem('audioOn', 'true');}
        setSpeaker(!speaker.current);
        

      } else{
        if(mobile){
        const audio = new Audio('/audio/click.mp3');
        audio.play();
          sayAWord('o');
        }
        if(speaker.current){localStorage.setItem('audioOn', 'false')}else{localStorage.setItem('audioOn', 'true');}
      setSpeaker(!speaker.current);
      }
    }} >
          <GiSpeaker size = {40} />
          <p type="optionstext">NARRATE</p>
        </div>}
        
        {/*  <div className="OptionsButton" style={{color: transVisible? null:'gray'}} onClick={() => { setTransVisible(!transVisible); setKeyboard(mobile)}} >
          <FaBook size = {40} />
          <p type="optionstext">SUBTITLES</p>
        </div>
       */}
         
        {!mobile && <div className="OptionsButton" style={{color: keyboard.current ? 'gray':null}} onClick={() => {
      setKeyboard(!keyboard.current);setTransVisible(true);
      navigator.mediaDevices.getUserMedia({ audio: true })
      if(status=="waiting") {setStatus("reading")}                                                                                                           }} >
          <FaMicrophone size = {40} />
           <p type="optionstext">USE VOICE</p>
        </div>}

        
      </div>
    </div>
  );
}

export default OptionsBar;