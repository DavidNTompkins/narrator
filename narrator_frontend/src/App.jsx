// THIS IS NO LONGER USED - Not Updated! Transitioned to Create.jsx

import React, { useState,useCallback, useEffect, useRef } from 'react';
import handleSubmit from "./api.jsx";
import AvatarComponent from "./AvatarComponent.jsx"
import woosh from "/src/audio/woosh.wav"
import listen from "./listen.jsx"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import presets from './presets/basePresets.json'
import ClickableButton from './togglebutton.jsx';
import DropdownButton from './dropdown.jsx';
import InstructionButton from './instructionButton.jsx'
import logoImage from './img/logo.png'
import GameStatus from "./gameStatus.jsx"
//import AudioRecorder from 'audio-recorder-polyfill'
import getBrowser from './getBrowser.js'
import ShareButton from './shareButton.jsx'
import Subtitles from './subtitles.jsx'
import OptionsBar from'./optionsBar/optionsBar.jsx'
import sayAWord from './smallScripts/sayAWord.js'
import Toolbar from './userControlBar/userToolbar'
import { auth, provider } from './smallScripts/firebaseConfig';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import Navbar from './navbar/Navbar';
import EditableImage from './smallScripts/EditableImage.jsx'
import {trackPageView,trackEvent} from './smallScripts/analytics.js' 
import Hallucinator from './smallScripts/hallucinator.jsx'
import AddCharacterIcon from './smallScripts/AddCharacterIcon.jsx'
import TokenCounter from './tokenManagement/TokenCounter.jsx'
import fetchWithRetry from './smallScripts/FetchWithRetry.js'




//import ImageTransition from './smallScripts/logoTransition.jsx'

function MyApp({user,setUser}) {
  const [showForm, setShowForm] = useState(true);
  const [adventureID, setAdventureID] = useState(null);
  const [save,setSave] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [characters, setCharacters] = useState(["!", "?"]);
  const [messages, setMessages] = useState([])
  const [imageData, setImageData] = useState([null,null]);
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
  const hyperionNeeded = React.useRef(hyperionNeededVar);
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

  //code to handle the baker
  useEffect(() => {
    if (tokenFlag & rebake) {
      fetchData();
      setRebake(false);
    }
  }, [tokenFlag,hyperionFlag]);

  async function fetchData() {
    let additionalCharacterString = "";
    additionalCharacters.forEach(item => {
      if(!(item.inactive==true)){
      additionalCharacterString += `${item.name} - ${item.role} - ${item.background} (DM Controlled)\n`;
      }
    });
    const companionString = additionalCharacters.length==0 ? `the player has a companion` : `the player has these companions`
    
    const unbakedIngredients = `The player is:
${formData.name1} - ${formData.race1} - ${formData.class1}
Additionally ${companionString}:
${formData.name2} - ${formData.race2} - ${formData.class2} (DM Controlled)
${additionalCharacterString}`
    const response = await fetchWithRetry('https://api.playnarrator.com/bake',{
  method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({unbakedIngredients, userID }),
  })
    const result = await response.json();
    const data = await result.message;
    console.log(data);
    setBakedCharacters(data);
    setUseBaked(true);
  }
  
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
                                            background1: '',
                                            background2: '', 
                                            gametype: '',
                                            storyhook: '',
                                           })

  // Defining form max lengths:
  const nameLength = 500;
  const attributeLength = 3000;
  const backgroundLength = 6000;
  const settingLength = 800;
  const gametypeLength = 800;
  const storyhookLength = 1000;
  
    useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);
  
  useEffect(() => {
    // This observer is called when the user state changes (e.g., sign in or sign out)
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    // Handling the redirect result after successful authentication
   getRedirectResult(auth)
    .then((result) => {
      if (result && result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
      }
    })
    .catch((error) => {
      // Handle errors
      console.error(error.code, error.message);
    });

    return () => {
      unsubscribe();
    };
  }, []);

    const userID = user ? user.uid : "NotLoggedIn";

  
  const handleCharacterEdit = (index, name, role, background, description) => {
    setRebake(true);
  if (index === 0 || index === 1) {
    setFormData({ ...formData, 
                 [`name${index+1}`]: name,
                [`race${index+1}`]: role,
                [`class${index+1}`]: background,
                [`background${index+1}`]: description})
    
    // Handle the edit action for the first two EditableImage components
  } else {
    setAdditionalCharacters((prevAdditionalCharacters) =>
      prevAdditionalCharacters.map((prevCharacter,i) =>
        i === index - 2
          ? {
              name: name,
              role: role,
              background: background,
              description: description,
              inactive: prevCharacter.inactive ? true : false,
            }
          : prevCharacter
      )
    );
  }
};
  const handleCharacterActivation = (index) => {
    if (index >= 2 ) {
      setAdditionalCharacters((prevAdditionalCharacters) =>
      prevAdditionalCharacters.map((prevCharacter,i) =>
        i === index - 2
          ? {
              name: prevCharacter.name,
              role: prevCharacter.role,
              background: prevCharacter.background,
              description: prevCharacter.description,
              inactive: !prevCharacter.inactive,
            }
          : prevCharacter
      )
    );
    }
  }
const handleCharacterDelete = (index) => {
  if (index >= 2) {
    setAdditionalCharacters((prevAdditionalCharacters) =>
      prevAdditionalCharacters.filter((_, i) => i !== index - 2)
    );
    setImageData((prevImageData) =>
      prevImageData.filter((_, i) => i !== index)
    );
  } else {
    console.log("Cannot delete characters at index 0 and 1");
  }
};
  
  const signInWithGoogle = () => {
    signInWithRedirect(auth, provider);
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
      .then(data => setFormData(data))
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
        <a className="logo-div" href ="https://playnarrator.com">
        <img className="logo" src ={logoImage}></img>
        </a>
      <Navbar>
      
      </Navbar>
       
        
        
      {!((browser == 'chrome')| !(formVisible))  && 
        <h4>Audio turned off on-non chrome browser by default.</h4>
        }
          {formSubmitted &&  <TokenCounter formData={formData} messages={messages} editableTextlog={editableTextlog} additionalCharacters={additionalCharacters} tokenFlag={tokenFlag} setTokenFlag= {setTokenFlag} setUseBaked = {setUseBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded} bakedCharacters={bakedCharacters} />}
        
       
      </header>
        <a href="https://discord.gg/gFGuHv6YBZ" target="_blank" rel="noopener noreferrer"><button className="blue-button">Join Discord</button></a>
        <a href="https://www.reddit.com/r/playnarrator/" target="_blank" rel="noopener noreferrer"><button className="reddit-button">Check Reddit</button>
        </a>

        
         <Toolbar formData={formData} save={save} setSave={setSave} user={user} setUser={setUser} messages={messages} adventureID={adventureID} setAdventureID={setAdventureID} hyperionSummary={hyperionSummary} setHyperionSummary={setHyperionSummary} setHyperionFlag={setHyperionFlag} auth={auth} provider={provider} imageData={imageData} setImageData={setImageData} isPublished={isPublished} additionalCharacters={additionalCharacters} textlog={textlog} setTextlog={setTextlog} hyperionNeeded ={hyperionNeeded} setHyperionNeeded ={setHyperionNeeded} editableTextlog={editableTextlog} bakedCharacters={bakedCharacters}/>
        
        {!(mobile & formVisible) &&<OptionsBar transVisible={transVisible} setTransVisible={setTransVisible} formData={formData} id={id} setID={setID} mobile={mobile} keyboard={keyboard} setKeyboard={setKeyboard} status={status} setStatus={setStatus} user={user} adventureID={adventureID} setAdventureID={setAdventureID} auth={auth} provider={provider} imageData={imageData} isPublished={isPublished} setIsPublished={setIsPublished} speaker={speaker} setSpeaker={setSpeaker} utterancesRef={utterancesRef} textlog={textlog} setTextlog={setTextlog} editableTextlog={editableTextlog} setEditableTextlog={setEditableTextlog} additionalCharacters={additionalCharacters} browser={browser}/>}
       
        
        </div>
      
      <div type = "presetOptions" style={formVisible ? {visibility: 'visible'} : {visibility: 'hidden',height:'15px'}}>
       <GameStatus status={status}/>
      <>
        <DropdownButton title="Adventure" menuItems={presets.Adventure} onItemClick={setFormData} />
        <DropdownButton title="Space" menuItems={presets.Space} onItemClick={setFormData} />
        <DropdownButton title="Familiar Tales" menuItems={presets["Familiar Tales"]} onItemClick={setFormData} />
        <DropdownButton title="Western" menuItems={presets.Western} onItemClick={setFormData} />
        <DropdownButton title="Animals" menuItems={presets["Animals"]} onItemClick={setFormData} />
        <DropdownButton title="Slice-of-Life" menuItems={presets["Slice-of-Life"]} onItemClick={setFormData} />
        <DropdownButton title="Historical" menuItems={presets.Historical} onItemClick={setFormData} />
        <DropdownButton title="Weird Stuff" menuItems={presets["Weird Stuff"]} onItemClick={setFormData} />

      </>
      
      </div>
      
      {(showForm) ? (
      <>
      <div style = {formStyle} type="form" className="createForm">
        <form style = {formStyle} method="post" onSubmit={ async (e) => {
          if (prompts.length != 0){
            return
          }
        if(browser == "safari"){
          sayAWord("oh");
        }
          setPrompts([""])
        e.preventDefault();
        trackEvent('adventure',{action:'customGame-start'});
        setFormVisible(false);
        const response = await fetch('https://api.playnarrator.com/access',{
  method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
        const result = await response.json()
        //console.log('here2')
        if(result.code =="good"){
          const audio = new Audio(woosh);
          audio.play();
          //navigator.mediaDevices.getUserMedia({ audio: true })
          console.log("in primary loop")
          
          if(!formSubmitted){ handleSubmit(e, setShowForm, setPrompts, setCharacters, setMessages,setImageData,setStatus,setHandler) }
          setFormSubmitted(true);
          
          
        } else {
          alert("Your submission was flagged by our content moderation. Please remove explicit content and try again.")
          location.reload();
        }
        }}>
          <fieldset className="character-left">
            <legend>Your Character</legend>
            <div>
              <label>
                1st Character Name:
                <input type="text" name="name1" placeholder="Main Character Name" maxLength={nameLength} value={formData.name1} onChange={event => setFormData({ ...formData, name1: event.target.value })} />
              </label>
            </div>
            <div>
              <label>
                What are they like:
                <input type="text" name="race1" placeholder="e.g., An evil wizard, carries a sword" maxLength={attributeLength} value={formData.race1} onChange={event => setFormData({ ...formData, race1: event.target.value })}/>
              </label>
            </div>
            <div>
              <label>
                Background or Motive:
                <input type="text" name="class1" placeholder="e.g., He is trying to avenge his son." value={formData.class1} maxLength={attributeLength} onChange={event => setFormData({ ...formData, class1: event.target.value })}/>
              </label>
            </div>
            <div>
              <label htmlFor="background1">Appearance (does not affect story):</label> <br></br>
              <textarea id="background1" name="background1" placeholder="e.g., A man with dark black hair, wearing a red wizard hat." rows="5" cols="30" maxLength={backgroundLength} value={formData.background1} onChange={event => setFormData({ ...formData, background1: event.target.value })} ></textarea>

            </div>
          </fieldset>
        
          <fieldset className="character-right">
            <legend>Your Companion</legend>
            <div>
              <label>
                2nd Character Name:
                <input type="text" name="name2" placeholder="Second Character Name" maxLength= {nameLength} value={formData.name2} onChange={event => setFormData({ ...formData, name2: event.target.value })} />
              </label>
            </div>
            <div>
              <label>
                What are they like?:
                <input type="text" name="race2" placeholder="e.g., A grumpy little dog with bad breath" maxLength={attributeLength} value={formData.race2} onChange={event => setFormData({ ...formData, race2: event.target.value })}/>
              </label>
            </div>
            <div>
              <label>
                Background or Motive:
                <input type="text" name="class2" placeholder="e.g., He was born on a farm..." maxLength={attributeLength} value={formData.class2} onChange={event => setFormData({ ...formData, class2: event.target.value })}/>
              </label>
            </div>
            <div>
              <label htmlFor="background2">Appearance (does not affect story):</label> <br></br>
              <textarea id="background2" name="background2" placeholder="e.g., A dog with scraggly hair" maxLength={backgroundLength} rows="5" cols="30" value={formData.background2} onChange={event => setFormData({ ...formData, background2: event.target.value })}></textarea>

            </div>
          </fieldset>
          <label type="options" className="labelOptions">
          Location:<br></br>
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
          
          <button className= "startButton" type="submit">Start Game</button>
        </form>
         
        </div>
      
      </>
      ) : (
      
      
        <div className="avatars" style = {{width: mobile ? transVisible ? "90vw":"":""?"":""}}>
          <AvatarComponent prompts={prompts} characters={characters} messages={messages} setMessages={setMessages} imageData={imageData} setImageData={setImageData} handler={handler} setHandler={setHandler} setStatus={setStatus} browser={browser} formData={formData} textlog={textlog} setTextlog={setTextlog} editableTextlog={editableTextlogRef} setEditableTextlog={setEditableTextlog} transVisible={transVisible} mobile={mobile} keyboard={keyboard} speaker = {speaker} hyperionSummary={hyperionSummary} setHyperionSummary={setHyperionSummary} hyperionFlag={hyperionFlag} setHyperionFlag={setHyperionFlag} user={user} save={save} adventureID={adventureID} utterancesRef={utterancesRef} additionalCharacters={additionalCharacters} bakedCharacters={bakedCharacters} useBaked={useBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded} AISpokeLast={false}/>
          
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
          />
            <EditableImage
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
          />
             {additionalCharacters.map((char, index) => (
            <EditableImage
            imageData={imageData}
            setImageData={setImageData}
            index={index+2}
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
            key={index}
          />
        ))}
            {!mobile && <br></br>}
            {(additionalCharacters.length<8) && <div className="add-icon-div">
            <button className="add-icon-button"
  onClick={async () => {
    await setImageData([...imageData,
                 'https://firebasestorage.googleapis.com/v0/b/narrator-380314.appspot.com/o/users%2FHmvVLyjbgXYrKSMLSqgcCz8lUNg1%2Fadventures%2Fd661cdc9-23b1-420f-be42-15f427b3e4ff%2Fimage-1?alt=media&token=888f6b63-0bf1-4b14-b111-43ff3db46780']);
    setAdditionalCharacters([
      ...additionalCharacters,
      {
        name:"", // some thoughts - pass whole thing [indexd] to editableImage? for easier edit? 
        role: "", // Set default or empty values for the new component
        background: "",
        description: "a humanoid",
      },
    ]);
    
  }}
>
  <AddCharacterIcon />
</button> 
             </div>}
      </div>
          
           <Subtitles textlog={textlog} editableTextlog={editableTextlog} mobile={mobile} transVisible={transVisible} keyboard={keyboard} status={status}formData={formData} handler={handler} setHandler={setHandler} setTextlog={setTextlog} setEditableTextlog={setEditableTextlog} hyperionFlag={hyperionFlag} setHyperionFlag={setHyperionFlag} messages={messages} setMessages={setMessages}setStatus={setStatus} hyperionSummary={hyperionSummary} imageData={imageData} setImageData={setImageData} additionalCharacters={additionalCharacters} tokenFlag={tokenFlag} bakedCharacters={bakedCharacters} useBaked={useBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded}/>
        </div>
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