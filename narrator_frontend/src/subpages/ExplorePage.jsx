import { useLocation } from 'react-router-dom';
import React, { useState,useCallback, useEffect,useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdventurePage.css'
import ClickableButton from '../togglebutton.jsx';
import DropdownButton from '../dropdown.jsx';
import logoImage from '../img/logo.png'
import createImage from '../img/create.png';
import continueImage from '../img/continue.png'; // this is silly but consistent <3
import GameStatus from "../gameStatus.jsx"
import getBrowser from '../getBrowser.js'
import ShareButton from '../shareButton.jsx'
import OptionsBar from'../optionsBar/optionsBar.jsx'
import Login from '../userControlBar/logIn'
import { auth, provider } from '../smallScripts/firebaseConfig';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy, limit,  startAfter } from 'firebase/firestore';
import AdventureCard from '../smallScripts/AdventureCard';
import './ExplorePage.css'
import handleSubmit from "./ExploreAPI.jsx";
//import AvatarComponent from "../AvatarComponent.jsx"
import lilwoosh from "/src/audio/lilwoosh.mp3"
import listen from "../listen.jsx"
import InstructionButton from '../instructionButton.jsx'
import AudioRecorder from 'audio-recorder-polyfill'
//import Subtitles from '../subtitles.jsx'
import sayAWord from '../smallScripts/sayAWord.js'
import Toolbar from '../userControlBar/userToolbar'
import Navbar from '../navbar/Navbar';
import { FaSearch, FaArrowRight, FaArrowLeft} from 'react-icons/fa';
import { incrementField } from '../smallScripts/firebaseHelpers';
import { v4 as uuidv4 } from 'uuid';
//import EditableImage from '../smallScripts/EditableImage.jsx'
import {trackPageView,trackEvent} from '../smallScripts/analytics.js'
import CookieConsent from 'react-cookie-consent'
//import AddCharacterIcon from '../smallScripts/AddCharacterIcon.jsx'
//import AddWorldIcon from '../smallScripts/AddWorldIcon.jsx'
import TokenCounter from '../tokenManagement/TokenCounter.jsx'
import fetchWithRetry from '../smallScripts/FetchWithRetry.js'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import algoliasearch from 'algoliasearch';
import FullscreenComponent from '../tokenManagement/Whoops.jsx';
import {GiPlainCircle} from 'react-icons/gi';
import { LuSprout } from "react-icons/lu";
import { FaMedal,FaCrown } from "react-icons/fa"; //best
import getUserRole from './AccountPageItems/getUserRole.jsx';
import NewPlayerModal from './explorePageitems/NewPlayerModal.jsx';
import PromoCard from '../promo/PromoCard'
import PromoCharacter from '../promo/PromoCharacter'
import { useSubscription } from './AccountPageItems/SubscriptionContext.jsx';
import SkeletonCard from './explorePageitems/SkeletonCard.jsx';
import AdComponent from '../promo/AdComponent.jsx';
import AdCharacter from '../promo/AdCharacter.jsx';
import { HallucinationProvider } from '../hallucinator/HallucinationContext';
import HallucinatorFields from '../hallucinator/HallucinatorFields.jsx';
import GameplayCore from '../GameplayCore.jsx';
import { set } from 'react-ga';
import CreateCard from '../CreatePageTools/CreateCard.jsx';
import {rulesets} from '../presets/rules.js'



//largely brought over from main app script.
const ExplorePage = ({user,setUser}) => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState('#242631');
  const [status, setStatus] = useState('');
  const [adventureID,setAdventureID] = useState('');
  const [adventures, setAdventures] = useState([]);
  const [selectedAdventureIndex, setSelectedAdventureIndex] = useState(null);
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
    rules:rulesets.Standard,
    model:'GPT 4o-Mini',
    hallucinator: [{key:'general_style',value:'high quality, realistic, highly detailed'}],
    censorImages: true,
    guessHallucinationStyles:true,
    trackedFields: [{key:'',value:''}],
    reminderActive:false,
    reminderText: '',
    frequency_penalty: 0.5,
    repetition_penalty: 0.8,
    presence_penalty:0.2,
    temperature:0.8,
    baker_model:'Default'
   })

  const [imageData,setImageData] = useState([]);
  const [adventureStarted,setAdventureStarted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [handler, setHandler]= useState(0);
  const [messages, setMessages] = useState([]);
  const [formVisible, setFormVisible] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [id, setID] = useState(null);
  const [textlog, setTextlog] = useState('');
  const [retrievedAdventures, setRetrievedAdventures] = useState([]);
  const [tokenFlag, setTokenFlag] =useState(false);
  const [transVisible,setTransVisible] = useState(true);
  const [keyboardVar,_setKeyboard] = useState(true);
  const [hyperionSummary, setHyperionSummary] = useState("");
  const [hyperionFlag, setHyperionFlag] = useState(false);
  const keyboard = React.useRef(keyboardVar);
  const [save,setSave] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [safeSearch, setSafeSearch] = useState(true);
  const [characters, setCharacters] = useState(["!", "?"]);
  const [additionalCharacters, setAdditionalCharacters] = useState([]);
  const [bakedCharacters,setBakedCharacters] = useState("");
  const [rebake, setRebake] = useState(true);
  const [useBaked, setUseBaked] = useState(false); 
  const [editableTextlog, setEditableTextlog] = useState('');
  const [customRules, setCustomRules] = useState('');
  const [snapshots, setSnapshots] = useState(null);
  const [authorId, setAuthorId] = useState('');
  const [abortController, setAbortController] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const timeoutIdsRef = useRef([]);
  const [logginComplete, setLogginComplete] = useState(false);
  const [downgraded, setDowngraded] = useState(false);
  const genreOptions = [
    "Adventure",
    "Sci-Fi",
    "Fantasy",
    "CYOA",
    "Fan-Fiction",
    "AI Weirdness",
    "Mystery",
    "Crime",
    "Anime",
    "Romance",
    "Action",
    "Comedy",
    "Horror",
    "Drama",
    "NSFW",
    "Other"];
  const [firstVisit, setFirstVisit] = useState(true);
  const activeTimeouts = useRef(0);
  const { hasSubscription, subscriptionType, subscriptionLoaded } = useSubscription();
  const [promoSlot, setPromoSlot] = useState(3);
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';



  const closeBlocker = () =>{setFirstVisit(false)}
  const [additionalCharactersOffset, setAdditionalCharactersOffset] = useState(1);
  const editableTextlogRef = useRef(editableTextlog);
  useEffect(() => {
    editableTextlogRef.current = editableTextlog;
  }, [editableTextlog]);

  useEffect(() => {
    if (!localStorage.getItem('hasVisited2') && !user) {
       setFirstVisit(true);
      localStorage.setItem('hasVisited2', 'true');
      console.log('new guy')
      // Display the message or component for new users
    }else{
      console.log('old')
    }
  },[user])
  
  const utterancesRef = React.useRef([]); // used to hold ongoing utterances.
  const [speakerVar,_setSpeaker] = useState(localStorage.getItem('audioOn') === 'true');
  const speaker = React.useRef(speakerVar);
  function setSpeaker(point) {
    speaker.current = point;
    _setSpeaker(point);
  }
  function setKeyboard(point) {
  keyboard.current = point; // Updates the ref, taken from SO
  _setKeyboard(point);
}
  const [hyperionNeededVar,_setHyperionNeeded] = useState(false);
  const hyperionNeeded = React.useRef(hyperionNeededVar);
  function setHyperionNeeded(point) {
    hyperionNeeded.current = point;
    _setHyperionNeeded(point);
  }
  const setRules = (newRules) => {
  setFormData(prevFormData => {
    return {...prevFormData, rules: newRules}
  });
};
const [modelOptions,setModelOptions] = useState(["GPT 4o-Mini", "Open Orca", "Hermes", "Toppy","Open 3.5", "Hermes 13b", "MythoMax 13b", "MythoMist 7b", "Hermes Mixtral", "Dolphin Mixtral"]);
const setModelSelection = (newModel) => {
  setFormData(prevFormData => {
    return {...prevFormData, model: newModel}
  });
};
  /*useEffect(() => {   
    if(timeoutIdsRef && utterancesRef){
      console.log('settingTimemout ', Math.max(timeoutIdsRef.current.length, utterancesRef.current.length));
    activeTimeouts.current = Math.max(timeoutIdsRef.current.length, utterancesRef.current.length);
      
    }
      }, [timeoutIdsRef.current.length,utterancesRef.current.length]);*/
  // used to enable interrupt button.
  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = []; // Reset the array after clearing the timeouts
  };

  
  let logoGameWidth = '15vw'
  var firstpass=true;
  useEffect(() => {
  if(firstpass){trackPageView();}
    firstpass=false;
  },[]);

  useEffect(() => {
   if (formData.name2 || formData.race2 || formData.class2 || formData.background2) {
     setAdditionalCharactersOffset(2);
    } else{
     setAdditionalCharactersOffset(1); 
    }
  },[formData]);
  
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
                              : 'Open 3.5'
                            : formData.baker_model
                          : 'Open 3.5' }),
  })
  const result = await response.json();
  const data = await result.message;
  console.log(data);
  setBakedCharacters(data);
  setUseBaked(true);
}


  var mobile = false;

    useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

   useEffect(() => {
    console.log('explorepage Mounted/Updated');

    return () => {
      console.log('explorepage Unmounted');
    };
  }, []);
  
/*  useEffect(() => {
    // This observer is called when the user state changes (e.g., sign in or sign out)
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setLogginComplete(true);
      } else {
        setUser(null);
        console.log('USER NOT LOGGED IN');
        setLogginComplete(true);
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
  }, []);*/

  const userID = user ? user.uid : "NotLoggedIn";
  const { userRole, error } = getUserRole(userID);
  
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
  
useEffect(()=>{
  if(handler>= 12 && subscriptionType!="gold"){
    setDowngraded(true);    
  }
  console.log("handler ",handler)
},[handler])

// freeloader reductions
  useEffect(()=> {
    if(downgraded){
      console.log(subscriptionType)
    if(subscriptionType=="silver"||subscriptionType=="None"){
      if(formData.model=="GPT 4o-Mini"){
        setModelSelection("Open 3.5");
      }
      setModelOptions(["Open Orca", "Hermes","Toppy", "Open 3.5", "Hermes 13b", "MythoMist 7b"]) // discount models
    } else if(subscriptionType =="free") {
      if(formData.model != "Open 3.5" && formData.model != "MythoMist 7b"){
      setModelSelection("Open 3.5");
    }
      setModelOptions(["Open 3.5", "MythoMist 7b"]);
    }} 
  },[subscriptionType,formData.model,downgraded])


  const signInWithGoogle = () => {
    signInWithRedirect(auth, provider);
  };
  
  const browser = getBrowser();
  // checking browser/mobile settings
  useEffect(()=>{
  if(browser!="chrome"){
    setSpeaker(false);
  }
    },[browser])
  
  if (window.innerWidth <= 768) { 
    mobile = true;
    /*document.addEventListener('contextmenu', function (e) {
      // stop long touch hold from popping up context menus
      e.preventDefault();
  })*/};
  logoGameWidth = mobile ? '33vw':'15vw'

//const client = algoliasearch('', '');
//const index = client.initIndex('publishedAdventuresFull');
const [searchText, setSearchText] = useState('');
const [submittedSearchText, setSubmittedSearchText] = useState('');

const handleSearchSubmit = () => {
  const lowerSearchWords = searchText.toLowerCase().split(' ').filter(word => word.trim() !== '');

  setSubmittedSearchText(lowerSearchWords);
};

// Gathering adventures and nextpaging
const [lastVisible, setLastVisible] = useState(null);
const [startAts, setStartAts] = useState([]);
const [sortType, setSortType] = useState('best');  // 'new' or 'popular' or 'best
const [selectedGenre, setSelectedGenre] = useState(''); // '' means all genres

const fetchAdventures = async (lastDoc, ignoreLastVisible = false) => {
  console.log("getting adventures");
  console.log(startAts, lastVisible);
  const db = getFirestore();
  let q;

  let orderField = sortType === 'new' 
  ? 'createdAt' 
  : sortType === 'popular'
  ? 'playCount'
  : 'rankedRating';

  let orderDirection = sortType === 'new' ? 'desc' : 'desc'; // Change the order direction if needed

  // Define a general base query
  let generalBaseQuery = query(
    collection(db, "publishedAdventures"),
    where("published", "==", true),
    ...(selectedGenre ? selectedGenre=="nsfw" ? [] : [where("genre", "==", selectedGenre)] : []), // <-- Add this line
    ...(safeSearch ? [where("isNsfw", "array-contains-any", ["notNSFW"])] : 
        selectedGenre=="nsfw" ? [where("isNsfw", "array-contains-any", ["NSFW"])]:[]),
    orderBy(orderField, orderDirection),
    ...(ignoreLastVisible ? [] : lastVisible ? [startAfter(lastVisible)] : []),
    limit(11)
  );

  // Define a base query specifically for authorId (removes NSFW filter)
  let authorBaseQuery = query(
    collection(db, "publishedAdventures"),
    where("published", "==", true),
    orderBy(orderField, orderDirection),
    ...(lastVisible ? [startAfter(lastVisible)] : []),
    limit(100)
  );

  // If user wants to search for a specific keyword
  if (submittedSearchText.length > 0) {
    setAdventures([]);
    q = query(
      generalBaseQuery,
      where("searchString", "array-contains-any", submittedSearchText)
    );
  } 
  // If user wants to filter by authorId (Removes NSFW filter)
  else if (authorId) {
    setAdventures([]);
    q = query(
      authorBaseQuery,
      where("authorName", "==", authorId)
    );
  } 
  // If user wants the default list
  else {
    setAdventures([]);
    q = generalBaseQuery;
  }

  const querySnapshot = await getDocs(q);
  const fetchedAdventures = [];
  querySnapshot.forEach((doc) => {
    fetchedAdventures.push(doc.data());
  });

  // Get the last visible document
  let lastVisibleSnapshot = querySnapshot.docs[querySnapshot.docs.length-1];
  setLastVisible(lastVisibleSnapshot);
  
  // Add current startAt document to list
  if (querySnapshot.docs[0]) {
    setStartAts(prevStartAts => [...prevStartAts, querySnapshot.docs[0]]);
  }

  setAdventures(fetchedAdventures);
  setPromoSlot(Math.floor(1+Math.random() * 11));
};

  // Injecting Ad code for unauthed users:
 /* useEffect(() => {
      // Check if user is a real user and doesn't have a subscription
      if (logginComplete && (subscriptionType === 'free' || (!user && subscriptionType === 'None')) && !hasSubscription) {
          // Create script element
          const script = document.createElement('script');
          script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7204332781805355";
          script.async = true;
          script.crossOrigin = "anonymous";

          // Append script to the body or head
          document.body.appendChild(script);

          // Cleanup function to remove the script when the component unmounts
          return () => {
              document.body.removeChild(script);
          };
      }
  }, [logginComplete, subscriptionType, user, hasSubscription]); // Dependencies
*/

useEffect(() => {
  if(!isLoading){
  fetchAdventures();
  }
}, [submittedSearchText, safeSearch, sortType,authorId]);

  useEffect(() => {
    // Reset lastVisible and startAts to their initial states
    setLastVisible(null);
    setStartAts([]);
    
    // Then fetch the adventures again to start from the top
    
      fetchAdventures(null, true);
    setIsLoading(false);
    if(selectedGenre=="nsfw"){
      setSafeSearch(false);
    }
      }, [selectedGenre]);

  
/*useEffect(() => {
  fetchAdventures();
}, [submittedSearchText, safeSearch, sortType]); */

const handleNext = () => {
  fetchAdventures(lastVisible);
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

const handlePrev = () => {
  // Remove the current page's startAt document from list and set lastVisible to the previous page's startAt document
  console.log('back')
  setStartAts(prevStartAts => {
    const newStartAts = [...prevStartAts];
    newStartAts.pop();
    fetchAdventures(newStartAts[newStartAts.length - 1]);
    return newStartAts;
  });
};

  const handleAdventureDelete = (adventureID) => {
    // Create a new array without the deleted adventure
    const updatedAdventures = adventures.filter(adventure => adventure.adventureID !== adventureID);
    // Set the new state
    setAdventures(updatedAdventures);
};

const handleSortChange = () => {
  // Switch the sort type among 'popular', 'best', 'new' and reset page
  setSortType(prevSortType => {
    switch (prevSortType) {
      case 'popular':
        return 'best';
      case 'best':
        return 'new';
      default:
        return 'popular';
    }
  });
  setLastVisible(null);
  setStartAts([]);
};


  const updateModel = (index, newModel) => {
    setAdventures(adventures => {
      return adventures.map((adventure, i) => {
        if (i === index) {
          return {
            ...adventure,
            adventureFormData: {
              ...adventure.adventureFormData,
              model: newModel,
            },
          };
        }
        return adventure;
      });
    });
  };

  // handling button click:
  const handleAdventureSelect = async (e,index,type,newFormData='',newAdditionalCharacters='') => {
    if(type=='image' || type=='create-image'){
      localStorage.setItem('hallucinationOn', JSON.stringify(true));
      setSpeaker(true);
      //sayAWord('o');
    } else if(type=='text' || type=='create-text'){
      localStorage.setItem('hallucinationOn', JSON.stringify(false));
      setSpeaker(false);
    }
    if(index!==false){
    trackEvent('adventure',{action:'adventure-start'});
    setSelectedAdventureIndex(index);
    setImageData(adventures[index].images);
    setFormData(adventures[index].adventureFormData);
    setModelSelection(adventures[index].adventureFormData.model || 'Open 3.5');
    setCustomRules(adventures[index].adventureFormData.rules ? adventures[index].rules : '');
    if(adventures[index].additionalCharacters){
      await setAdditionalCharacters(adventures[index].additionalCharacters);
    }
    incrementField('publishedAdventures', adventures[index].adventureID, "playCount")
    setAdventureID(await uuidv4())
        if (adventureStarted){
            return
          }
        }
        
    setAdventureStarted(true);
        if(browser == "safari"){
          //sayAWord("oh");
        }
        e.preventDefault();
        //setFormVisible(false);
        const response = await fetch(`${api_url}access`,{
  method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
        const result = await response.json()
        //console.log('here2')
        if(result.code =="good"){
         // const audio = new Audio(lilwoosh);
         // audio.play();
          
          console.log("in primary loop")
          
          if(!formSubmitted && index!==false){ handleSubmit(e, setShowForm, setCharacters, setMessages,setStatus,setHandler,adventures[index].adventureFormData, adventures[index].additionalCharacters ? adventures[index].additionalCharacters : additionalCharacters) }
          //handling specific create-card submission
          if(index===false){ 
            setAdventureID(await uuidv4())
            setAdditionalCharacters(newAdditionalCharacters);
            setFormData(newFormData);
            handleSubmit(e, setShowForm, setCharacters, setMessages,setStatus,setHandler,newFormData, newAdditionalCharacters) 
          }
          setFormSubmitted(true);
          
          
        } else {
          alert("Your submission was flagged by our content moderation. Please remove explicit content and try again.")
          location.reload();
        }
      }
    const formStyle = {
    opacity: formVisible ? 1 : 0,
    pointerEvents: formVisible ? 'auto' : 'none',
    transition: 'opacity 1s ease'
  };

  
  return (
    <>
    {false ? <FullscreenComponent/> :
    <>
      
      {false && <NewPlayerModal auth={auth} user={user} setUser={setUser} provider={provider} closeBlocker={closeBlocker}/> }
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
                                                             : !adventureStarted ? '35vw':logoGameWidth}}></img>
          </a>
        
          <Toolbar formData={formData} save={save} setSave={setSave} user={user} setUser={setUser} messages={messages} adventureID={adventureID} setAdventureID={setAdventureID} hyperionSummary={hyperionSummary} setHyperionSummary={setHyperionSummary} setHyperionFlag={setHyperionFlag} auth={auth} provider={provider} imageData={imageData} setImageData={setImageData} isPublished={true} additionalCharacters={additionalCharacters} textlog={textlog} setTextlog={setTextlog} hyperionNeeded ={hyperionNeeded} setHyperionNeeded ={setHyperionNeeded} editableTextlog={editableTextlog} bakedCharacters={bakedCharacters}/>
          </div>
          
        
        {(adventureStarted) &&<OptionsBar transVisible={transVisible} setTransVisible={setTransVisible} formData={formData} id={id} setID={setID} mobile={mobile} keyboard={keyboard} setKeyboard={setKeyboard} status={status} setStatus={setStatus} user={user} adventureID={adventureID} setAdventureID={setAdventureID} auth={auth} provider={provider} imageData={imageData} isPublished={true} setIsPublished={console.log} speaker={speaker} setSpeaker={setSpeaker} utterancesRef={utterancesRef} textlog={textlog} setTextlog={setTextlog} editableTextlog={editableTextlog} setEditableTextlog={setEditableTextlog} additionalCharacters={additionalCharacters} browser={browser} setModelSelection={setModelSelection} modelOptions={modelOptions} setRules={setRules} customRules={customRules} setCustomRules={setCustomRules} setFormData={setFormData} onExplorePage={true}/>}


      {(browser == 'safari') && (!adventureStarted) && 
        <h4>Audio not available on Safari.</h4>
        }
        <TokenCounter formData={formData} messages={messages} editableTextlog={editableTextlog} additionalCharacters={additionalCharacters} tokenFlag={tokenFlag} setTokenFlag= {setTokenFlag} setUseBaked = {setUseBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded} bakedCharacters={bakedCharacters} />
        
       
      </header>
        <a href="https://discord.gg/KhRHNerQjj" target="_blank" rel="noopener noreferrer"><button className="blue-button">Join Discord</button></a>
       
        
        </div>
      <div type = "AdventurePageGameStatusBlock" style={true ? {visibility: 'visible'} : {visibility: 'hidden',height:'15px'}}>
      <GameStatus status={status}/>
        </div>
      {showForm && <>
        {/* <div className="search-container">
  <input
    className="search-input"
    type="text"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    placeholder="Search adventures"
  />
  <button className="search-button" onClick={handleSearchSubmit}>
    <FaSearch />
  </button>
  <label htmlFor="safe-search-toggle" className="safe-search-label">
    Safe Search
    <input
      id="safe-search-toggle"
      className="safe-search-toggle safe-search-toggle-slider"
      type="checkbox"
      checked={safeSearch}
      onChange={() => {
        setSafeSearch(!safeSearch);
      setLastVisible(null);
    setStartAts([]);
      }}
    />
  </label>
</div> */}
       
      </>
}
      {(showForm) ? (!adventureStarted && 
      <>
          
        <div className="explore-paged">
        <CreateCard 
        formData={formData} 
        setFormData={setFormData} 
        onButtonClick={handleAdventureSelect} 
        browser={browser}
        mobile={mobile}
        setImageData={setImageData}
        setAdditionalCharacters={setAdditionalCharacters}
        userID={userID}
        />
           
                <br></br>
      <PromoCard />
        </div>
        <br></br>
         
        </>
     ) :  (
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
          <AvatarComponent prompts={prompts} characters={characters} messages={messages} setMessages={setMessages} imageData={imageData} setImageData={setImageData} handler={handler} setHandler={setHandler} setStatus={setStatus} browser={browser} formData={formData} textlog={textlog} setTextlog={setTextlog} editableTextlog={editableTextlogRef} setEditableTextlog={setEditableTextlog} transVisible={transVisible} mobile={mobile} keyboard={keyboard} speaker={speaker} hyperionSummary={hyperionSummary} setHyperionSummary={setHyperionSummary} hyperionFlag={hyperionFlag} setHyperionFlag={setHyperionFlag} user={user} save={save} adventureID={adventureID} utterancesRef={utterancesRef} additionalCharacters={additionalCharacters} bakedCharacters={bakedCharacters} useBaked={useBaked} hyperionNeeded={hyperionNeeded} setHyperionNeeded={setHyperionNeeded} AISpokeLast={false} abortController={abortController} setAbortController={setAbortController} isStreamActive={isStreamActive} setIsStreamActive={setIsStreamActive} timeoutIdsRef={timeoutIdsRef}/>
          
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
             {!hasSubscription && <AdCharacter />}
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
        description: "mid range portrait of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, ghibli, dynamic lighting, render, symmetric, baroque oil on canvas, digital character, square picture, centered subject",
        type:type,
        key:index,
      },
    ]);
    
    
  }}
>
  {type==="character" ? <AddCharacterIcon /> : <AddWorldIcon />}
</button>))} 
             </div>}
             {!hasSubscription && <PromoCharacter mobile={mobile} />}
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
        description: "beautiful landscape art of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, ghibli, dynamic lighting, render, symmetric, baroque oil on canvas, digital character, square picture, centered subject",
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
        </div>*/}
        </HallucinationProvider> 
          )} 
      
    </div>
      <div className="MainLinks">
           <a href="/terms">Terms</a>
          <a href="/FAQ">FAQ</a>
          <a href="/privacy">Privacy</a>
              </div>

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="cookieBannerConsent"
        expires={150}
        containerClasses="cookie-banner-container"
        buttonClasses="cookie-banner-button"
        contentClasses="cookie-banner-content"
      >
        {`This used to tell you about cookies. Technically there are still cookies sent back and forth when you send a message - but it's just going to your computer now. So I guess you're tracking yourself? IDK, either way, they're semi-anonymized and the minimum necessary to keep sessions consistent.`} 
      </CookieConsent>
    </>}</>
  );
}
const toolbarStyle = {
  position: "fixed",
  top: 0,
  right: "20px", // Set a fixed value here
  display: "flex",
  alignItems: "center",
  height: "50px",
  padding: "0 20px",
  backgroundColor: "#004040",
  zIndex: 999,
  border: "2px solid #007a7a",
};


export default ExplorePage;
