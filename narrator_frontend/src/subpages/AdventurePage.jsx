import { useLocation,useParams } from 'react-router-dom';
import React, { useState,useCallback, useEffect, useRef } from 'react';
import handleSubmit from "./AdventureAPI.jsx";
//import AvatarComponent from "../AvatarComponent.jsx"
import woosh from "/src/audio/woosh.wav"
import listen from "../listen.jsx"
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdventurePage.css'
import presets from '../presets/basePresets.json';
import ClickableButton from '../togglebutton.jsx';
import { v4 as uuidv4 } from 'uuid';
import DropdownButton from '../dropdown.jsx';
import InstructionButton from '../instructionButton.jsx';
import logoImage from '../img/logo.png';
import createImage from '../img/create.png'
import continueImage from '../img/continue.png'
import GameStatus from "../gameStatus.jsx";
import AudioRecorder from 'audio-recorder-polyfill';
import getBrowser from '../getBrowser.js';
import ShareButton from '../shareButton.jsx';
//import Subtitles from '../subtitles.jsx';
import OptionsBar from'../optionsBar/optionsBar.jsx';
import sayAWord from '../smallScripts/sayAWord.js';
import Toolbar from '../userControlBar/userToolbar';
import { auth, provider } from '../smallScripts/firebaseConfig';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import EditableImage from '../smallScripts/EditableImage.jsx';
import {trackPageView,trackEvent} from '../smallScripts/analytics.js'
//import AddCharacterIcon from '../smallScripts/AddCharacterIcon.jsx';
//import AddWorldIcon from '../smallScripts/AddWorldIcon.jsx';
import TokenCounter from '../tokenManagement/TokenCounter.jsx';
import fetchWithRetry from '../smallScripts/FetchWithRetry.js';
import HorizontalRow from '../CreatePageTools/HorizontalRow.jsx';
import OptionSelector from '../CreatePageTools/OptionSelector.jsx'
import {rulesets} from '../presets/rules.js'
import {encode} from '@nem035/gpt-3-encoder';
import generatePrimaryPrompt from '../smallScripts/PromptGenerator.js'
import SummaryEdit  from '../adventurePage/SummaryEdit.jsx'
//import LoginBlocker from '../LoginBlocker.jsx';
import ModelSelector from '../CreatePageTools/ModelSelector.jsx';
import TrackerFields from '../CreatePageTools/TrackerFields.jsx';
import ReminderBox from '../CreatePageTools/ReminderBox.jsx';
import ExtraAdvancedFeatures from '../CreatePageTools/ExtraAdvancedFeatures.jsx';
import { useSubscription } from './AccountPageItems/SubscriptionContext.jsx';
import SubscriptionBlocker from '../SubscriptionBlocker.jsx';
import CreateAccountPopup from './AccountPageItems/CreateAccountPopup.jsx'
import NoAccountBlocker from '../NoAccountBlocker.jsx';
import { HallucinationProvider } from '../hallucinator/HallucinationContext';
import HallucinatorFields from '../hallucinator/HallucinatorFields.jsx';
import GameplayCore from '../GameplayCore.jsx';
import AdventureVideoModal from './AdventureVideoModal.jsx';
import FeatureControl from '../adventurePage/FeatureControl.jsx';
import DownloadAdventureButton from './DownloadButton.jsx';
import FileUploadComponent from './FileUploadComponent.jsx';

//largely brought over from main app script.
const AdventurePage = ({user,setUser}) => {
  const { paramID,isPublic,autoStart } = useParams();
  const location = useLocation();
  const [newgame, setNewgame] = useState(false);
  const [showForm,setShowForm] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [save,setSave] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [characters, setCharacters] = useState(["!", "?"]);
  const [messages, setMessages] = useState([])
  const [handler, setHandler] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#242631');
  const [formVisible, setFormVisible] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const [id, setID] = useState(null);
  const [textlog, setTextlog] = useState('');
  const [transVisible,setTransVisible] = useState(true);
  const [keyboardVar,_setKeyboard] = useState(true);
  const [hyperionSummary, setHyperionSummary] = useState("");
  const [hyperionFlag, setHyperionFlag] = useState(false);
  const [speakerVar,_setSpeaker] = useState(localStorage.getItem('audioOn') === 'true');
  const [tokenFlag, setTokenFlag] =useState(false);
  const [bakedCharacters,setBakedCharacters] = useState("");
  const [rebake, setRebake] = useState(true);
  const [useBaked, setUseBaked] = useState(false);
  const [hyperionNeededVar,_setHyperionNeeded] = useState(false);
  const [retrievedAdventures, setRetrievedAdventures] = useState([]);
  const [primaryPromptLength, setPrimaryPromptLength] = useState(0);
  const hyperionNeeded = React.useRef(hyperionNeededVar);
  const [additionalCharactersOffset, setAdditionalCharactersOffset] = useState(1);
  const [customRules, setCustomRules] = useState('');
  const [snapshots, setSnapshots] = useState(null);
  const formRef = useRef(null);
  const { hasSubscription, subscriptionType } = useSubscription();
  const [editingExistingGame, setEditingExistingGame] =useState(false);
  const [existingGamePacket,setGamePacket] = useState({});
  const [abortController, setAbortController] = useState(null);
  const [alternativeSummary, setAlternativeSummary] = useState('');
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isSummaryAltered,setSummaryAltered] = useState(false);
  const timeoutIdsRef = useRef([]);
  const [activeTimeouts, setActiveTimeouts] = useState(0);
  const [hallucinationImage, setHallucinationImage] = useState(null);
  const [downgraded, setDowngraded] = useState(false);

  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  
  function setHyperionNeeded(point) {
    hyperionNeeded.current = point;
    _setHyperionNeeded(point);
  }

  //adventure based state variables
  const [additionalCharacters, setAdditionalCharacters] = useState([]);
  const [adventureID, setAdventureID] = useState('');
  const [imageData, setImageData] = useState([null,null]);
  const [isPublished,setIsPublished] = useState(null); 
  const [adventureData, setAdventureData] = useState({adventureName : "Load a Game"})
  const [formData, setFormData] = useState({
                                            setting: '', 
                                            name1: '',
                                            name2: '',
                                            race1: '',
                                            race2: '',
                                            class1: '',
                                            class2: '',
                                            background1: '',
                                            background2: '', 
                                            gametype: '',
                                            storyhook: '',
                                            rules: '',
                                            model:'GPT 4o-Mini',
                                            hallucinator: [{key:'general_style',value:'high quality, realistic, highly detailed'}],
                                            censorImages: true,
                                            trackedFields: [{key:'',value:''}],
                                            reminderActive:false,
                                            reminderText: '',
                                            frequency_penalty: 0.2,
                                            repetition_penalty: 0.8,
                                            presence_penalty:0.2,
                                            temperature:0.8,  
                                            baker_model:'Default'
                                           })



  
  // easy handler for generic handling of formData change
      const handleInputChange = (key, value) => {
        setFormData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };
  
   const setRules = (newRules) => {
  setFormData(prevFormData => {
    return {...prevFormData, rules: newRules}
  });
};
  // model options
  const [modelOptions,setModelOptions] = useState(["GPT 4o-Mini", "Open Orca", "Hermes", "Toppy","Open 3.5", "Hermes 13b", "Mixtral", "MythoMax 13b", "MythoMist 7b", "Hermes Mixtral", "Dolphin Mixtral"]);
    const setModelSelection = (newModel) => {
    setFormData(prevFormData => {
      return {...prevFormData, model: newModel}
    });
  };

    //code to check subscription type and move off gpt3.5 if not gold
    useEffect(()=> {
      if(subscriptionType=="silver"){
        if(formData.model=="GPT 4o-Mini"){
          setModelSelection("Open 3.5");
        }
        localStorage.setItem('hallucinationOn', JSON.stringify(false));
        setDowngraded(true);
        setModelOptions(["Open Orca", "Hermes","Toppy", "Open 3.5", "Hermes 13b", "MythoMist 7b", "MythoMax 13b" ]) // discount models
      } else if(subscriptionType =="free") {
        localStorage.setItem('hallucinationOn', JSON.stringify(false));
        setDowngraded(true);
        if(formData.model != "Open 3.5"  && formData.model != "MythoMist 7b"){
        setModelSelection("Open 3.5");
      }
        setModelOptions(["Open 3.5", "MythoMist 7b"]);
      } 
    },[subscriptionType,formData.model])
  
  // used to enable interrupt button.
  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = []; // Reset the array after clearing the timeouts
  };
  
  // custom form submission handler:
  const handleFormSubmit = async (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  if (browser === "safari") {
    //sayAWord("oh");
  }

  setPrompts([""]);
  trackEvent('adventure', { action: 'savedGame-Start' });

  const response = await fetch(`${api_url}access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (result.code === "good") {
    console.log("in primary loop");

    if (!formSubmitted) {
      if (!isPublic && !newgame) {
        handleSubmit(e, setShowForm, setPrompts, setCharacters, setMessages, imageData, setImageData, setStatus, setHandler, formData, adventureData.adventureSummary.at(-1).text, additionalCharacters, lasttimeMessages, isPublic, bakedCharacters, useBaked, AISpokeLast);
      } else {
        handleSubmit(e, setShowForm, setPrompts, setCharacters, setMessages, imageData, setImageData, setStatus, setHandler, formData, "public adventure, no summary", additionalCharacters, lasttimeMessages, (isPublic || newgame));
      }
      setFormSubmitted(true);
    }
  } else {
    alert("Your submission was flagged by our content moderation. Please remove explicit content and try again.");
    location.reload();
  }
};

  

  useEffect(()=> {
  if(!formSubmitted){
    const PrimaryString = generatePrimaryPrompt(formData, additionalCharacters,"",false,formData.rules);
    setPrimaryPromptLength(encode(PrimaryString+formData.setting+formData.storyhook).length);
  }
  },[formData,additionalCharacters])
  
  //const lasttimeString = `\n------ Welcome back ------\n`;
  const [lasttimeMessages,setLasttimeMessages] = useState([]);
  //for textlog
  const [editableTextlog, setEditableTextlog] = useState('');
  const editableTextlogRef = useRef(editableTextlog);
  useEffect(() => {
    editableTextlogRef.current = editableTextlog;
  }, [editableTextlog]);
  
  const speaker = React.useRef(speakerVar);
  function setSpeaker(point) {
    speaker.current = point;
    _setSpeaker(point);
  }    
  const utterancesRef = React.useRef([]); // used to hold ongoing utterances.
  const keyboard = React.useRef(keyboardVar); // setting ref for easier live access
  function setKeyboard(point) {
  keyboard.current = point; // Updates the ref, taken from SO
  _setKeyboard(point);
}
  const [AISpokeLast,setAISpokeLast] = useState(false);
  // loading fresh data
  const handleAdventureLoaded = (loadedAdventureData) => {
    setAdventureData(loadedAdventureData);
    setAdventureID(loadedAdventureData.adventureID);
    setIsPublished(loadedAdventureData.published || isPublic);
    setTextlog(loadedAdventureData.transcript ? ('...' + loadedAdventureData.transcript) : '');
    setLasttimeMessages(loadedAdventureData.lastMessages || []);
    setBakedCharacters(loadedAdventureData.bakedCharacters || '');
    setImageData(loadedAdventureData.images || [null, null]);
    setAdditionalCharacters(loadedAdventureData.additionalCharacters || []);
    setFormData(loadedAdventureData.adventureFormData);
    setCustomRules(loadedAdventureData.adventureFormData.rules || rulesets.Standard);
    setAlternativeSummary(loadedAdventureData.adventureSummary ? loadedAdventureData.adventureSummary.at(-1).text : '');

    if (loadedAdventureData.lastMessages && loadedAdventureData.lastMessages[loadedAdventureData.lastMessages.length - 1].role === "assistant") {
      setAISpokeLast(true);
      setTextlog((prevText) => prevText + `${loadedAdventureData.lastMessages[loadedAdventureData.lastMessages.length - 1].content}`);
    } else {
      setAISpokeLast(false);
    }
  };

  


  // checking for quickstart settings
  useEffect(() =>{
    if(autoStart=='autostart'){ // allows for quick hop in on shared games
          if (formVisible && formData.name1) {
            handleFormSubmit(new Event('submit')); // remove e - but triggers infinite reload
          }
        } else if(userID  && (autoStart=='editing' || (adventureData.published && adventureData.userID==userID && (isPublic !== "public")))){
      console.log('edit mode live')
      setGamePacket({
        adventureName:adventureData.adventureName || null,
        tags: adventureData.tags || null,
        isNsfw: adventureData.isNsfw || null,
        genre: adventureData.genre || null,
        gameDescription: adventureData.gameDescription || null,
        authorName: adventureData.authorName || null
      })
      setEditingExistingGame(true);
        }
    //console.log(adventureData.published)
  },[formData]);

  
  
useEffect(() => {
   if (formData.name2 || formData.race2 || formData.class2 || formData.background2) {
     setAdditionalCharactersOffset(2);
    } else{
     setAdditionalCharactersOffset(1); 
    }
  },[formData]);
  //code to handle the baker
  useEffect(() => {
    if (tokenFlag && rebake) { // add handler here to reduce baking
      console.log('tokenFlag: ',tokenFlag)
      fetchData();
      setRebake(false);
    }
  }, [tokenFlag,hyperionFlag]);

  async function fetchData() {
  let additionalCharacterString = "";
  let worldString = "";

  // First pass: handle 'character' or no type
  additionalCharacters.forEach(item => {
    if(!(item.inactive==true) && (!item.type || item.type === 'character')){
      additionalCharacterString += `${item.name} - ${item.role} - ${item.background} (DM Controlled)\n`;
    }
  });

  // Second pass: handle 'world'
  additionalCharacters.forEach(item => {
    if(!(item.inactive==true) && item.type === 'world'){
      worldString += `${item.name} - ${item.role} \n`;
    }
  });

  const companionString = additionalCharacters.length==0 ? `the player has a companion` : `the player has these companions`
  
  const unbakedIngredients = `The player is:
${formData.name1} - ${formData.race1} - ${formData.class1}
Additionally ${companionString}:
${formData.name2} - ${formData.race2} - ${formData.class2} (DM Controlled)
${additionalCharacterString}
Here is some additional information about the world and or setting:
${worldString}`
  const response = await fetchWithRetry(`${api_url}bake`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({unbakedIngredients, 
                          userID,
                          model:formData.baker_model 
                          ? (formData.baker_model=='Default') 
                            ? formData.model 
                              ? formData.model
                              : 'GPT 4o-Mini'
                            : formData.baker_model
                          : 'GPT 4o-Mini' }),
  })
  const result = await response.json();
  const data = await result.message;
  console.log(data);
  setBakedCharacters(data);
  setUseBaked(true);
}


  var mobile = false;
  //const [mobile,setMobile] = useState(null);
 

    useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);
  
  
  const userID = user ? user.uid : "NotLoggedIn";

 const handleCharacterEdit = (index, name, role, background, description) => {
    setRebake(true);
  if (index < additionalCharactersOffset) { // if this is primary or secondary if there exists secondary
    setFormData({ ...formData, 
                 [`name${index+1}`]: name,
                [`race${index+1}`]: role,
                [`class${index+1}`]: background,
                [`background${index+1}`]: description})
    
    // Handle the edit action for the first two EditableImage components
  } else {
    setAdditionalCharacters((prevAdditionalCharacters) =>
      prevAdditionalCharacters.map((prevCharacter,i) =>
        i === index - additionalCharactersOffset 
          ? {
              name: name,
              role: role,
              background: background,
              description: description,
              type: prevCharacter.type ? prevCharacter.type : 'character',
              inactive: prevCharacter.inactive ? true : false,
            }
          : prevCharacter
      )
    );
  }
};
  const handleCharacterActivation = (index) => {
    if (index >= additionalCharactersOffset ) {
      setAdditionalCharacters((prevAdditionalCharacters) =>
      prevAdditionalCharacters.map((prevCharacter,i) =>
        i === index - additionalCharactersOffset
          ? {
              name: prevCharacter.name,
              role: prevCharacter.role,
              background: prevCharacter.background,
              description: prevCharacter.description,
              type: prevCharacter.type ? prevCharacter.type : 'character',
              inactive: !prevCharacter.inactive,
            }
          : prevCharacter
      )
    );
    }
  }
const handleCharacterDelete = (index) => {
  if (index >= additionalCharactersOffset) {
    setAdditionalCharacters((prevAdditionalCharacters) =>
      prevAdditionalCharacters.filter((_, i) => i !== index - additionalCharactersOffset)
    );
    setImageData((prevImageData) =>
      prevImageData.filter((_, i) => i !== index)
    );
  } else {
    console.log("Cannot delete primary characters");
  }
};
  
  const signInWithGoogle = () => {
    signInWithRedirect(auth, provider);
  };
  
  // not relevant for saved adventures
  /*var firstStart= true
  useEffect(() => {
    if(firstStart){
      
    console.log('checking for params');
    const queryParameters = new URLSearchParams(window.location.search)
    const storyID = queryParameters.get("storyid")
    if (!(storyID==null)){
      fetch('https://Narratornoncriticalbackend.davidtompkins3.repl.co/getStory', {
          method: 'POST',
          headers: {
    'Content-Type': 'application/json'
  },
          body: JSON.stringify({storyID})
    })
      .then(response => response.json())
      .then(data => setFormData(data))
      .catch(error => setStatus('bad code'));
    }}
    firstStart = false;
},[]);*/

  // checking browser/mobile settings
  const browser = getBrowser();
  // checking browser/mobile settings
  useEffect(()=>{
  if(browser!="chrome"){
    setSpeaker(false);
  }
    },[browser])
const nativeMediaRecorder = window.MediaRecorder;
  //window.MediaRecorder = AudioRecorder
  if (window.innerWidth <= 768) { 
    mobile = true;
    document.addEventListener('contextmenu', function (e) {
      // stop long touch hold from popping up context menus
      e.preventDefault();
  })};

  return (

    <>
    <ToastContainer />
    <div type = "mega">
      <div className = "headline">
      <header>
        <div className="logo-div">
        <a href ="/create">
          <img className="createIcon" src={createImage}></img>
        </a>
        <a href ="/adventure">
            <img className="createIcon" src={continueImage}></img>
          </a>
        <a className="logo-a" href ="/">
          <img className="logo" src ={logoImage} style={{margin:mobile ? 'auto' : '0 20px 0 20px', 
                                                         width: mobile ?
                                                           '55vw'
                                                           : '35vw'}}></img>
        </a>
          <Toolbar formData={formData} save={save} setSave={setSave} user={user} setUser={setUser} messages={messages} adventureID={adventureID} setAdventureID={setAdventureID} hyperionSummary={hyperionSummary} setHyperionSummary={setHyperionSummary} setHyperionFlag={setHyperionFlag} auth={auth} provider={provider} imageData={imageData} setImageData={setImageData} isPublished={isPublished} additionalCharacters={additionalCharacters} textlog={textlog} setTextlog={setTextlog} hyperionNeeded ={hyperionNeeded} setHyperionNeeded ={setHyperionNeeded} editableTextlog={editableTextlog} bakedCharacters={bakedCharacters}/>
          </div>
      {(browser == 'safari') && (formVisible)  && 
        <h4>Text-to-speech not available on Safari.</h4>
        }
        <TokenCounter formData={formData} messages={messages} editableTextlog={editableTextlog} additionalCharacters={additionalCharacters} tokenFlag={tokenFlag} setTokenFlag= {setTokenFlag} setUseBaked = {setUseBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded} bakedCharacters={bakedCharacters}/>
       
      </header>
        <a href="https://discord.gg/KhRHNerQjj" target="_blank" rel="noopener noreferrer"><button className="blue-button">Join Discord</button></a>

          {(!user && (isPublic !== "public" && autoStart !== 'autostart')) && <CreateAccountPopup auth={auth} user={user} setUser={setUser} provider={provider} />}
        
        
        
        {(!(mobile & !formSubmitted) || (autoStart=="editing" && userID)) &&<OptionsBar transVisible={transVisible} setTransVisible={setTransVisible} formData={formData} id={id} setID={setID} mobile={mobile} keyboard={keyboard} setKeyboard={setKeyboard} status={status} setStatus={setStatus} save={save} setSave={setSave} user={user} adventureID={adventureID} setAdventureID={setAdventureID} auth={auth} provider={provider} imageData={imageData} isPublished={isPublished} setIsPublished={setIsPublished} speaker={speaker} setSpeaker={setSpeaker} utterancesRef={utterancesRef} textlog={textlog} setTextlog={setTextlog} editableTextlog={editableTextlog} setEditableTextlog={setEditableTextlog} additionalCharacters={additionalCharacters} browser={browser} setRules={setRules} customRules={customRules} setCustomRules={setCustomRules}  setModelSelection={setModelSelection} modelOptions={modelOptions} setFormData={setFormData} editingExistingGame={editingExistingGame} existingGamePacket={existingGamePacket}/>}
       
        
        </div>
      <div type = "AdventurePageGameStatusBlock" style={formVisible ? {visibility: 'visible'} : {visibility: 'hidden',height:'15px'}}>
      <GameStatus status={status}/>
        </div>
      {(showForm) ? (
      <>
      <div type="form" className="createForm" style = {{display: formSubmitted ? 'none':'visible', border: (primaryPromptLength>2000) ? (primaryPromptLength>3000) ? '2px solid red' : '1px solid yellow' : '' }}>
      <FileUploadComponent onAdventureLoaded={handleAdventureLoaded} />
        <form 
          ref={formRef}
          onSubmit= {handleFormSubmit}>
          <div className="title-text">{adventureData.adventureName}</div>
          {(primaryPromptLength>2000) ?
            (primaryPromptLength>3000) ? 
            <div style={{color:'white',border:'5px solid red', fontWeight:'bold',padding:'3px'}}>YIKES - This game is too big. It might work, but is likely to hit errors. Publishing is disabled. Currently at {primaryPromptLength} tokens before messages. Game will break if tokens ever exceed 4000.</div> :
            <div style={{color:'white',border:'1px solid yellow', fontWeight:'bold',padding:'3px'}}>This is a bigger adventure than most. It should work fine - but is likely to use the baker often, meaning lower fidelity to your written prompt.</div> :''
          }
          {!user && <NoAccountBlocker auth={auth} user={user} setUser={setUser} provider={provider} />}

          <HorizontalRow 
          formData={formData}
          additionalCharacters={additionalCharacters}
          setAdditionalCharacters={setAdditionalCharacters}
          imageData={imageData}
          setImageData={setImageData}
          mobile={mobile}
          transVisible={transVisible}
          handleCharacterEdit={handleCharacterEdit}
          handleCharacterDelete={handleCharacterDelete}
          user={user}
          handleCharacterActivation={handleCharacterActivation}
          additionalCharactersOffset={additionalCharactersOffset}
           retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures}
           type={'character'}
           />
          <br></br>
          <label type="options" className="labelOptions">
          Starting Location (only applies to new games):<br></br>
                <input type="text" className = "textSetting" name="setting" placeholder="e.g., On the road to the dark king's castle" value={formData.setting} onChange={event => setFormData({ ...formData, setting: event.target.value })}/>
          </label>
          <br></br>
          <label type="options" className="labelOptions">
          Genre:<br></br>
                <input type="text" className = "textSetting" name="gametype" placeholder="e.g., adventure or anime or slice-of-life"  value={formData.gametype} onChange={event => setFormData({ ...formData, gametype: event.target.value })}/>
            </label>
          <br></br>
          <label type="options" className="labelOptions">
          Story hook (only applies to new games):<br></br>
                <input type="text" className = "textSetting" name="storyhook" placeholder="e.g., They just found a glowing orb."  value={formData.storyhook} onChange={event => setFormData({ ...formData, storyhook: event.target.value })}/>
            </label>

        
        <div onClick={() => setShowAdvanced(!showAdvanced)} style={{cursor: "pointer"}}>
          <hr  />
          <span className='show-advanced'>{showAdvanced ? '▲' : '▼'} Advanced</span> 
          
        </div>

        <div className={`advanced-fields ${showAdvanced ? 'open' : ''}`}>
          
        <HorizontalRow 
          formData={formData}
          additionalCharacters={additionalCharacters}
          setAdditionalCharacters={setAdditionalCharacters}
          imageData={imageData}
          setImageData={setImageData}
          mobile={mobile}
          transVisible={transVisible}
          handleCharacterEdit={handleCharacterEdit}
          handleCharacterDelete={handleCharacterDelete}
          user={user}
          handleCharacterActivation={handleCharacterActivation}
          additionalCharactersOffset={additionalCharactersOffset}
          retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures}
          type={'world'}
           />
        <OptionSelector setRules={setRules} rules={formData.rules} customRules={customRules} setCustomRules={setCustomRules}/>  
          <br></br>
          <ModelSelector modelSelection={formData.model} setModelSelection={setModelSelection} options={modelOptions} /> 
          <br></br>
          <ExtraAdvancedFeatures formData={formData} setFormData={setFormData} modelOptions={modelOptions} />
          <br></br>
          <HallucinatorFields formData={formData} setFormData={setFormData} />
           <TrackerFields formData={formData} setFormData={setFormData} />
          <br></br>
          <ReminderBox formData={formData} 
                handleInputChange={handleInputChange} />

          {!isPublic && <SummaryEdit alternativeSummary={alternativeSummary} setAlternativeSummary={setAlternativeSummary} setAltered={setSummaryAltered}/>}
        </div>
          
           <hr />
           {true && adventureData.adventureSummary &&
           <FeatureControl user={user}>
           <AdventureVideoModal title={adventureData.adventureName} recorder={nativeMediaRecorder} formData={formData} summary={adventureData.adventureSummary.at(-1).text} additionalCharacters={additionalCharacters} />
           </FeatureControl>
           }
          {user && adventureData.adventureSummary && !isPublic && <button className= "startButton" onClick={()=> sayAWord('a')} style={{position:'relative'}} type="submit">{isSummaryAltered ? 'Continue with original summary' : 'Continue Saved Game' }
            {adventureData.adventureSummary && <span className="adventure-summary-tooltip">{adventureData.adventureSummary.at(-1).text}</span>}
          </button>}
          {user &&autoStart!="editing" && <button style ={{marginLeft:'0.8em'}} className= "startButton" type="submit" onClick={()=>{
              sayAWord('a');
              setSave(false);
              setAdventureID(null);
              setMessages([]);
              setAISpokeLast(false);
              setLasttimeMessages([]);
              setTextlog('');
              setNewgame(true);
             // setIsPublic(true);
            }}>Start New Game</button> }
          {isSummaryAltered && user &&
          <button style ={{marginLeft:'0.8em'}} className= "startButton" type="submit" onClick={async ()=>{
              sayAWord('a')
              setSave(false);
              setAdventureID(null);
              setMessages([]);
              setAISpokeLast(false);
              setLasttimeMessages([]);
              await setAdventureData({...adventureData, adventureSummary: [{text:alternativeSummary}]});
              setTextlog('');
              //setNewgame(true);
             // setIsPublic(true);
            }}>Start Game with altered summary</button>
          }
          {user && false && <DownloadAdventureButton paramID={paramID} isPublic={isPublic} prompt={generatePrimaryPrompt(formData,additionalCharacters,false,false)} />}
          
         
        </form>
      </div>
      </>
      ) : (
      
      <HallucinationProvider> 
        <GameplayCore 
          abortController={abortController}
          activeTimeouts={activeTimeouts}
          additionalCharacters={additionalCharacters}
          additionalCharactersOffset={additionalCharactersOffset}
          adventureID={adventureID}
          AISpokeLast={false}
          background={formData.class1}
          bakedCharacters={bakedCharacters}
          browser={browser}
          characters={characters}
          clearAllTimeouts={clearAllTimeouts}
          description={formData.background1}
          editableTextlog={editableTextlog}
          formData={formData}
          handleCharacterActivation = {handleCharacterActivation}
          handleCharacterDelete={handleCharacterDelete}
          handleCharacterEdit={handleCharacterEdit}
          handler={handler}
          hyperionFlag={hyperionFlag}
          hyperionNeeded={hyperionNeeded}
          hyperionSummary={hyperionSummary}
          imageData={imageData}
          inactive={false}
          index={0}
          isPrimaryCharacter={true}
          isStreamActive={isStreamActive}
          keyboard={keyboard}
          messages={messages}
          mobile={mobile}
          name={formData.name1}
          prompts={prompts}
          retrievedAdventures={retrievedAdventures}
          role={formData.race1}
          save={save}
          setAbortController={setAbortController}
          setAdditionalCharacters={setAdditionalCharacters}
          setEditableTextlog={setEditableTextlog}
          setHandler={setHandler}
          setHyperionFlag={setHyperionFlag}
          setHyperionNeeded={setHyperionNeeded}
          setHyperionSummary={setHyperionSummary}
          setImageData={setImageData}
          setIsStreamActive={setIsStreamActive}
          setMessages={setMessages}
          setRetrievedAdventures={setRetrievedAdventures}
          setSnapshots={setSnapshots}
          setStatus={setStatus}
          setTextlog={setTextlog}
          snapshots={snapshots}
          speaker={speaker}
          status={status}
          textlog={textlog}
          timeoutIdsRef={timeoutIdsRef}
          tokenFlag={tokenFlag}
          transVisible={transVisible}
          useBaked={useBaked}
          user={user}
          utterancesRef={utterancesRef}
          downgraded={downgraded}
          setDowngraded={setDowngraded}
          
          />
        {/*  
        <div className="avatars" style = {{width: mobile ? transVisible ? "90vw":"":""?"":""}}>
          <AvatarComponent prompts={prompts} 
            characters={characters} 
            messages={messages} 
            setMessages={setMessages} 
            imageData={imageData} 
            setImageData={setImageData} 
            handler={handler} 
            setHandler={setHandler} 
            setStatus={setStatus} 
            browser={browser} 
            formData={formData} 
            textlog={textlog} 
            setTextlog={setTextlog} 
            editableTextlog={editableTextlogRef} 
            setEditableTextlog={setEditableTextlog} 
            transVisible={transVisible} 
            mobile={mobile} 
            keyboard={keyboard} 
            speaker={speaker} 
            hyperionSummary={hyperionSummary} 
            setHyperionSummary={setHyperionSummary} 
            hyperionFlag={hyperionFlag} 
            setHyperionFlag={setHyperionFlag} 
            user={user} 
            save={save} 
            adventureID={adventureID} 
            utterancesRef={utterancesRef} 
            additionalCharacters={additionalCharacters} 
            bakedCharacters={bakedCharacters} 
            useBaked={useBaked} 
            hyperionNeeded={hyperionNeeded} 
            setHyperionNeeded={setHyperionNeeded} 
            AISpokeLast={AISpokeLast} 
            abortController={abortController} 
            setAbortController={setAbortController} 
            isStreamActive={isStreamActive} 
            setIsStreamActive={setIsStreamActive} 
            timeoutIdsRef={timeoutIdsRef}/>

           <div id="avatars">
          <EditableImage
            imageData={imageData}
            setImageData={setImageData}
            index={0}
            name={formData.name1}
            role={formData.race1}
            background={formData.class1}
            description={formData.background1}
            mobile={mobile}
            transVisible={transVisible}
            handleEdit={handleCharacterEdit}
            handleDelete={handleCharacterDelete}
            user={user}
            handleCharacterActivation = {handleCharacterActivation}
            inactive={false}
            retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures} 
            isPrimaryCharacter={true}
          />
            {additionalCharactersOffset>1 && <EditableImage
            imageData={imageData}
            setImageData={setImageData}
            index={1}
            name={formData.name2}
            role={formData.race2}
            background={formData.class2}
            description={formData.background2}
            mobile={mobile}
            transVisible={transVisible}
            handleEdit={handleCharacterEdit}
            handleDelete={handleCharacterDelete}
              user={user}
              handleCharacterActivation = {handleCharacterActivation}
            inactive={false}
            retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures} 
            isPrimaryCharacter={true}
          />}
             {additionalCharacters.map((char, index) => (
              (!char.type || char.type==="character") &&
            <EditableImage
            imageData={imageData}
            setImageData={setImageData}
            index={index+additionalCharactersOffset}
            name={char.name}
            role={char.role}
            background={char.background}
            description={char.description}
            mobile={mobile}
            transVisible={transVisible}
            handleEdit={handleCharacterEdit}
            handleDelete={handleCharacterDelete}
              user={user}
              handleCharacterActivation = {handleCharacterActivation}
            inactive={char.inactive}
            retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures}
            key={index}
              type={"character"}
          />
        ))}
            {!mobile && <br></br>}
            
            {(additionalCharacters.length<11) && <div className="add-icon-div">
              {['character'].map((type,index)=> (
          <button className="add-icon-button"
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await setImageData([...imageData,
                 `/${type}/image${Math.floor(Math.random() * 9)}.png`]);
    setAdditionalCharacters([
      ...additionalCharacters,
      {
        name:"", // some thoughts - pass whole thing [indexd] to editableImage? for easier edit? 
        role: "", // Set default or empty values for the new component
        background: "",
        description: "Mid range portrait of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, ghibli, dynamic lighting, render, symmetric, baroque oil on canvas, digital character, square picture, centered subject",
        type:type,
        key:index,
      },
    ]);
    
    
  }}
>
  {type==="character" ? <AddCharacterIcon /> : <AddWorldIcon />}
</button>))} 
             </div>}
             {additionalCharacters.map((char, index) => (
              (char.type==="world") &&
            <EditableImage
            imageData={imageData}
            setImageData={setImageData}
            index={index+additionalCharactersOffset}
            name={char.name}
            role={char.role}
            background={char.background}
            description={char.description}
            mobile={mobile}
            transVisible={transVisible}
            handleEdit={handleCharacterEdit}
            handleDelete={handleCharacterDelete}
              user={user}
              handleCharacterActivation = {handleCharacterActivation}
            inactive={char.inactive}
            retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures}
            key={index}
              type={'world'}
            
          />
        ))}
            {!mobile && <br></br>}
            
            {(additionalCharacters.length<11) && <div className="add-icon-div">
              {['world'].map((type,index)=> (
          <button className="add-icon-button"
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await setImageData([...imageData,
                 `/${type}/image${Math.floor(Math.random() * 9)}.png`]);
    setAdditionalCharacters([
      ...additionalCharacters,
      {
        name:"", // some thoughts - pass whole thing [indexd] to editableImage? for easier edit? 
        role: "", // Set default or empty values for the new component
        background: "",
        description: "Beautiful landscape art of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, ghibli, dynamic lighting, render, symmetric, baroque oil on canvas, digital character, square picture, centered subject",
        type:type,
        key:index,
      },
    ]);
    
    
  }}
>
  {type==="character" ? <AddCharacterIcon /> : <AddWorldIcon />}
</button>))} 
             </div>}
      </div>
          
           <Subtitles 
             textlog={textlog} 
             editableTextlog={editableTextlog} 
             mobile={mobile} 
             transVisible={transVisible} 
             keyboard={keyboard} 
             status={status}
             formData={formData} 
             handler={handler} 
             setHandler={setHandler} 
             setTextlog={setTextlog} 
             setEditableTextlog={setEditableTextlog} 
             hyperionFlag={hyperionFlag}
             setHyperionFlag={setHyperionFlag} 
             messages={messages} 
             setMessages={setMessages} 
             setStatus={setStatus} 
             hyperionSummary={hyperionSummary} 
             imageData={imageData} 
             setImageData={setImageData} 
             additionalCharacters={additionalCharacters} 
             tokenFlag={tokenFlag} 
             bakedCharacters={bakedCharacters} 
             useBaked={useBaked} 
             hyperionNeeded={hyperionNeeded} 
             setHyperionNeeded={setHyperionNeeded} 
             speaker={speaker} 
             setSnapshots={setSnapshots} 
             snapshots={snapshots} 
             abortController={abortController} 
             setAbortController={setAbortController} 
             isStreamActive={isStreamActive} 
             setIsStreamActive={setIsStreamActive} 
             timeoutIdsRef={timeoutIdsRef} 
             utterancesRef={utterancesRef} 
             clearAllTimeouts={clearAllTimeouts} 
             activeTimeouts={activeTimeouts}/>

        </div>*/}
      </HallucinationProvider> 
      )}
      
    </div>
      <div className="MainLinks">
           <a href="/terms">Terms</a>
          <a href="/FAQ">FAQ</a>
          <a href="/privacy">Privacy</a>
              </div>
    </>
  );
}


export default AdventurePage;
