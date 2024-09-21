import React, { useState,useCallback, useEffect, useRef } from 'react';
import handleSubmit from "./api.jsx";
import woosh from "/src/audio/woosh.wav"
import listen from "./listen.jsx"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import presets from './presets/basePresets.json';
import ClickableButton from './togglebutton.jsx';
import DropdownButton from './dropdown.jsx';
import InstructionButton from './instructionButton.jsx'
import logoImage from './img/logo.png'
import createImage from './img/create.png'
import continueImage from './img/continue.png'
import GameStatus from "./gameStatus.jsx"
import AudioRecorder from 'audio-recorder-polyfill'
import getBrowser from './getBrowser.js'
import ShareButton from './shareButton.jsx'
import OptionsBar from'./optionsBar/optionsBar.jsx'
import sayAWord from './smallScripts/sayAWord.js'
import Toolbar from './userControlBar/userToolbar'
import { auth, provider } from './smallScripts/firebaseConfig';
import { signInWithRedirect, getRedirectResult, getAuth, onAuthStateChanged  } from 'firebase/auth';
import Navbar from './navbar/Navbar';
import {trackPageView,trackEvent} from './smallScripts/analytics.js';
//import EditableImage from './smallScripts/EditableImage.jsx'; 
//import Subtitles from './subtitles.jsx'
//import Hallucinator from './smallScripts/hallucinator.jsx';
//import AddCharacterIcon from './smallScripts/AddCharacterIcon.jsx';
//import AddWorldIcon from './smallScripts/AddWorldIcon.jsx';
//import AvatarComponent from "./AvatarComponent.jsx"
import TokenCounter from './tokenManagement/TokenCounter.jsx';
import fetchWithRetry from './smallScripts/FetchWithRetry.js';
import HorizontalRow from './CreatePageTools/HorizontalRow.jsx';
import OptionSelector from './CreatePageTools/OptionSelector.jsx';
import CreateAccountPopup from './subpages/AccountPageItems/CreateAccountPopup.jsx'
import NoAccountBlocker from './NoAccountBlocker.jsx';
import {encode} from '@nem035/gpt-3-encoder';
import generatePrimaryPrompt from './smallScripts/PromptGenerator.js'
import ModelSelector from './CreatePageTools/ModelSelector.jsx';
import TrackerFields from './CreatePageTools/TrackerFields.jsx';
import ReminderBox from './CreatePageTools/ReminderBox.jsx'
import EmailVerificationModal from './subpages/AccountPageItems/EmailVerificationModal.jsx';
import { useSubscription } from './subpages/AccountPageItems/SubscriptionContext.jsx';
import { debounce } from './smallScripts/debounce.js';
import ExtraAdvancedFeatures from './CreatePageTools/ExtraAdvancedFeatures';
import { HallucinationProvider } from './hallucinator/HallucinationContext';
import HallucinatorFields from './hallucinator/HallucinatorFields.jsx';
import ShowCharacters from './hallucinator/ShowCharacters.jsx';
import GameplayCore from './GameplayCore.jsx'

//import Hallucinator from './hallucinator/Hallucinator.jsx';


//import ImageTransition from './smallScripts/logoTransition.jsx'

function MyApp({user,setUser}) {
  const [showForm, setShowForm] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [adventureID, setAdventureID] = useState(null);
  const [save,setSave] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [characters, setCharacters] = useState(["!", "?"]);
  const [messages, setMessages] = useState([])
  const [imageData, setImageData] = useState([`/character/image${Math.floor(Math.random() * 9)}.png`]);
  const [handler, setHandler] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#242631');
  const [formVisible, setFormVisible] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const [id, setID] = useState(null);
  const [textlog, setTextlog] = useState('');
  const [transVisible,setTransVisible] = useState(true);
  const [hyperionSummary, setHyperionSummary] = useState("");
  const [isPublished,setIsPublished] = useState(false);
  const [hyperionFlag, setHyperionFlag] = useState(false);
  const [speakerVar,_setSpeaker] = useState(localStorage.getItem('audioOn') === 'true');
  const speaker = React.useRef(speakerVar);
  const [additionalCharacters, setAdditionalCharacters] = useState([]);
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
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const timeoutIdsRef = useRef([]);
  const { hasSubscription, subscriptionType } = useSubscription();
  const [downgraded, setDowngraded] = useState(false);

  const activeTimeouts = useRef(0); 


  function setHyperionNeeded(point) {
    hyperionNeeded.current = point;
    _setHyperionNeeded(point);
  }
  
  // for editable textlog
 const [editableTextlog, setEditableTextlog] = useState('');
  const editableTextlogRef = useRef(editableTextlog);
  useEffect(() => {
    editableTextlogRef.current = editableTextlog;
  }, [editableTextlog]);

  // used to enable interrupt button.
  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = []; // Reset the array after clearing the timeouts
  };
  
  function setSpeaker(point) {
    speaker.current = point;
    _setSpeaker(point);
  }
    const utterancesRef = React.useRef([]); // used to hold ongoing utterances.
  
  const [keyboardVar,_setKeyboard] = useState(true);
  const keyboard = React.useRef(keyboardVar); // setting ref for easier live access
  function setKeyboard(point) {
  keyboard.current = point; // Updates the ref, taken from SO
  _setKeyboard(point);
}
  // checking email verification
   /*useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsVerified(user.emailVerified);
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const refreshVerificationStatus = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      setIsVerified(user.emailVerified);
    }
  };*/
  
  //code to handle the baker
  useEffect(() => {
    if (tokenFlag & rebake) {
      fetchData();
      setRebake(false);
    }
  }, [tokenFlag,hyperionFlag]);

 async function fetchData() {
  let additionalCharacterString = "";
  let worldString = "";

   // for timeouts
 /*  useEffect(() => {    
     activeTimeouts = (Math.max(timeoutIdsRef.current.length, utterancesRef.current.length));
       }, [timeoutIdsRef.current.length,utterancesRef.current.length]);
*/
   
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
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

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
                           : 'GPT 4o-Mini'}),
  })
  const result = await response.json();
  const data = await result.message;
  console.log(data);
  setBakedCharacters(data);
  setUseBaked(true);
}
// end baker 
  
  var mobile = false;
  //const [mobile,setMobile] = useState(null);
  const [formData, setFormData] = useState({
                                            setting: '', 
                                            name1: '',
                                            name2: '',
                                            race1: '',
                                            race2: '',
                                            class1: '',
                                            class2: '',
                                            background1: 'portrait of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, square picture, centered subject',
                                            background2: '', 
                                            gametype: '',
                                            storyhook: '',
                                            rules:'',
                                            model:'GPT 4o-Mini',
                                            hallucinator: [{key:'general_style',value:'high quality, realistic, highly detailed'}],
                                            censorImages: true,
                                            guessHallucinationStyles:true,
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
  
  // easy handler for setting rules as needed, passed to optionselector.
  const setRules = (newRules) => {
  setFormData(prevFormData => {
    return {...prevFormData, rules: newRules}
  });
};
  const [modelOptions,setModelOptions] = useState(["GPT 4o-Mini", "Open Orca", "Hermes", "Toppy","Open 3.5", "Hermes 13b", "Mixtral", "MythoMax 13b", "MythoMist 7b","Hermes Mixtral", "Dolphin Mixtral"]);
  const setModelSelection = (newModel) => {
  setFormData(prevFormData => {
    return {...prevFormData, model: newModel}
  });
};



  //code to check token lengths during game creation:
  useEffect(()=> {
  if(!formSubmitted){
    const PrimaryString = generatePrimaryPrompt(formData, additionalCharacters,"",false,formData.rules);
    setPrimaryPromptLength(encode(PrimaryString+formData.setting+formData.storyhook).length);
  }
  },[formData,additionalCharacters])
  
  // Defining form max lengths:
  const nameLength = 5000;
  const attributeLength = 30000;
  const backgroundLength = 60000;
  const settingLength = 8000;
  const gametypeLength = 8000;
  const storyhookLength = 10000;
  
    useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // debugging
  useEffect(() => {
    console.log('createpage Mounted/Updated');

    return () => {
      console.log('createpage Unmounted');
    };
  }, []);

  // setting additional character offset
useEffect(() => {
   if (formData.name2 | formData.race2 | formData.class2 | formData.background2) {
     setAdditionalCharactersOffset(2);
    } else{
     setAdditionalCharactersOffset(1); 
    }
  },[formData]);
  


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
    //signInWithRedirect(auth, provider);
  };
  
  // Grabbing prebuilt story if any
  var firstStart= true
  useEffect(() => {
    if(firstStart){
      trackPageView();
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
      .then(data => {
        if(data.name2 && imageData.length==1){
          setImageData(['/character/base_avatar.png',
                 `/character/base_avatar.png`]);
          setAdditionalCharacters([
          ...additionalCharacters,
          {
            name:data.name2, // some thoughts - pass whole thing [indexd] to editableImage? for easier edit? 
            role: data.race2, // Set default or empty values for the new component
            background: data.class2,
            description: data.background2,
            type:"character",
          },
            ]);
          
          
        }
          data.name2="";
          data.race2="";
          data.class2="";
          data.background2="";
          setFormData(data);
          console.log(data);
          setCustomRules(data.rules ? data.rules : '');
      
      })
      .catch(error => setStatus('bad code'));
    }}
    firstStart = false;
    
},[]);

  // checking browser/mobile settings
 const browser = getBrowser();
  // checking browser/mobile settings
  useEffect(()=>{
  if(browser!="chrome"){
    setSpeaker(false);
  }
    },[browser])
  
  window.MediaRecorder = AudioRecorder
  if (window.innerWidth <= 768) { 
    mobile = true;
    document.addEventListener('contextmenu', function (e) {
      // stop long touch hold from popping up context menus
      e.preventDefault();
  })};
  // Could set browser dependent defaults here (i.e. speaker)



  const formStyle = {
    opacity: formVisible ? 1 : 0,
    pointerEvents: formVisible ? 'auto' : 'none',
    transition: 'opacity 1s ease'
    
  };

  // for presets
  const handleButtonClick = () => {
  if (selectedOption) {
    setFormData(presets[selectedOption]);
  }
};
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
        
        
      {((browser == 'safari') && (formVisible))  && 
        <h4>Text-to-speech not supported on Safari.</h4>
        }
          {formSubmitted &&  <TokenCounter formData={formData} messages={messages} editableTextlog={editableTextlog} additionalCharacters={additionalCharacters} tokenFlag={tokenFlag} setTokenFlag= {setTokenFlag} setUseBaked = {setUseBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded} bakedCharacters={bakedCharacters}/>}
        
       
      </header>
        <a href="https://discord.gg/KhRHNerQjj" target="_blank" rel="noopener noreferrer"><button className="blue-button">Join Discord</button></a>

        {/*!user && <CreateAccountPopup auth={auth} user={user} setUser={setUser} provider={provider} />*/}
        
         
        
        {!(mobile & formVisible) &&<OptionsBar transVisible={transVisible} setTransVisible={setTransVisible} formData={formData} id={id} setID={setID} mobile={mobile} keyboard={keyboard} setKeyboard={setKeyboard} status={status} setStatus={setStatus} user={user} adventureID={adventureID} setAdventureID={setAdventureID} auth={auth} provider={provider} imageData={imageData} isPublished={isPublished} setIsPublished={setIsPublished} speaker={speaker} setSpeaker={setSpeaker} utterancesRef={utterancesRef} textlog={textlog} setTextlog={setTextlog} editableTextlog={editableTextlog} setEditableTextlog={setEditableTextlog} additionalCharacters={additionalCharacters} browser={browser} customRules={customRules} setCustomRules={setCustomRules} setModelSelection={setModelSelection} modelOptions={modelOptions} setRules={setRules} setFormData={setFormData}/>}
       
        
        </div>
      
      <div type = "presetOptions" style={formVisible ? {visibility: 'visible'} : {visibility: 'hidden',height:'15px'}}>
       <GameStatus status={status}/>
      
      </div>
      
      {(showForm) ? (
      <>
      <div style = {formStyle, {border: (primaryPromptLength>2000) ? (primaryPromptLength>3000) ? '2px solid red' : '1px solid yellow' : ''}} type="form" className="createForm">
        <form style = {formStyle} method="post" onSubmit={ async (e) => {
        e.preventDefault();

          if (prompts.length != 0){
            console.log('prompts exist')
            return
         //} else if (!isVerified) {
            //await refreshVerificationStatus();
           //if(!isVerified){
      //setShowEmailVerificationModal(true);
        //    return;
           // }
    } else 
        if(browser == "safari"){
          //sayAWord("oh");
        }
        console.log('now here');
          setPrompts([""])
        trackEvent('adventure',{action:'customGame-start'});
        setFormVisible(false);
        const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';
        const response = await fetch(`${api_url}access`,{
  method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
        const result = await response.json()
        //console.log('here2')
        if(result.code =="good"){
          //const audio = new Audio(woosh);
          //audio.play();
          //navigator.mediaDevices.getUserMedia({ audio: true })
          console.log("in primary loop")
          
          if(!formSubmitted){ handleSubmit(e, setShowForm, setPrompts, setCharacters, setMessages,setImageData,setStatus,setHandler,formData, additionalCharacters, additionalCharactersOffset) }
          setFormSubmitted(true);
          if((primaryPromptLength>3000)){setIsPublished(true)}
          
        } else {
          alert("Your submission was flagged by our content moderation. Please remove explicit content and try again.")
          location.reload();
        }
        }}>
          <div className="title-text">Create a Game</div>
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
         Starting Location:<br></br>
                <input type="text" className = "textSetting" name="setting" placeholder="e.g., On the road to the dark king's castle" maxLength={settingLength} value={formData.setting} onChange={event => setFormData({ ...formData, setting: event.target.value })}/>
          </label>
          <br></br>
          <label type="options" className="labelOptions">
          Genre:<br></br>
                <input type="text" className = "textSetting" name="gametype" placeholder="e.g., adventure or anime or slice-of-life" maxLength={gametypeLength} value={formData.gametype} onChange={event => setFormData({ ...formData, gametype: event.target.value })}/>
            </label>
          <br></br>
          <label type="options" className="labelOptions">
          Story hook:<br></br>
                <input type="text" className = "textSetting" name="storyhook" placeholder="e.g., They just found a glowing orb." maxLength={storyhookLength} value={formData.storyhook} onChange={event => setFormData({ ...formData, storyhook: event.target.value })}/>
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
        <OptionSelector setRules={setRules} rules={formData.rules} customRules={customRules} setCustomRules={setCustomRules} />  
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
        </div>
           <hr />
          {user && <button className= "startButton" type="submit" onClick={()=> sayAWord('a')}>Start Game</button>}
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
          {/*<div className="avatars" style = {{width: mobile ? transVisible ? "90vw":"":""?"":""}}>
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
            speaker = {speaker} 
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
            AISpokeLast={false} 
            abortController={abortController} 
            setAbortController={setAbortController} 
            isStreamActive={isStreamActive} 
            setIsStreamActive={setIsStreamActive} 
            timeoutIdsRef={timeoutIdsRef}
            />
          
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
        description: "Mid range portrait of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, square picture, centered subject",
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
        description: "Beautiful landscape art of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, square picture, centered subject",
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
          
           <Subtitles textlog={textlog} editableTextlog={editableTextlog} mobile={mobile} transVisible={transVisible} keyboard={keyboard} status={status}formData={formData} handler={handler} setHandler={setHandler} setTextlog={setTextlog} setEditableTextlog={setEditableTextlog} hyperionFlag={hyperionFlag} setHyperionFlag={setHyperionFlag} messages={messages} setMessages={setMessages}setStatus={setStatus} hyperionSummary={hyperionSummary} imageData={imageData} setImageData={setImageData} additionalCharacters={additionalCharacters} tokenFlag={tokenFlag} bakedCharacters={bakedCharacters} useBaked={useBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded} speaker={speaker} setSnapshots={setSnapshots} snapshots={snapshots} abortController={abortController} setAbortController={setAbortController} isStreamActive={isStreamActive} setIsStreamActive={setIsStreamActive} timeoutIdsRef={timeoutIdsRef} utterancesRef={utterancesRef} clearAllTimeouts={clearAllTimeouts} activeTimeouts={activeTimeouts}/>
        </div> */}
          </HallucinationProvider>
      )}
      {/*{!showForm && <Hallucinator textlog={textlog} genre={formData.gametype}/>*/ }
      
    </div>
      <div className="MainLinks">
           <a href="/terms">Terms</a>
          <a href="/FAQ">FAQ</a>
          <a href="/privacy">Privacy</a>
        </div>
    </>
  );
}

export default MyApp;