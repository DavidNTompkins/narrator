import { useLocation } from 'react-router-dom';
import React, { useState,useCallback, useEffect,useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdventurePage.css'
import ClickableButton from '../togglebutton.jsx';
import DropdownButton from '../dropdown.jsx';
import logoImage from '../img/logo.png'
import createImage from '../img/create.png'
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
import AvatarComponent from "../AvatarComponent.jsx"
import lilwoosh from "/src/audio/lilwoosh.mp3"
import listen from "../listen.jsx"
import InstructionButton from '../instructionButton.jsx'
import AudioRecorder from 'audio-recorder-polyfill'
import Subtitles from '../subtitles.jsx'
import sayAWord from '../smallScripts/sayAWord.js'
import Toolbar from '../userControlBar/userToolbar'
import Navbar from '../navbar/Navbar';
import { FaSearch, FaArrowRight, FaArrowLeft} from 'react-icons/fa';
import { incrementField } from '../smallScripts/firebaseHelpers';
import { v4 as uuidv4 } from 'uuid';
import EditableImage from '../smallScripts/EditableImage.jsx'
import {trackPageView,trackEvent} from '../smallScripts/analytics.js'
import CookieConsent from 'react-cookie-consent'
import AddCharacterIcon from '../smallScripts/AddCharacterIcon.jsx'
import AddWorldIcon from '../smallScripts/AddWorldIcon.jsx'
import TokenCounter from '../tokenManagement/TokenCounter.jsx'
import fetchWithRetry from '../smallScripts/FetchWithRetry.js'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import SubscriptionColumns from './PlansItems/SubscriptionColumns.jsx';




//formed off duplicate of explorepage
const Plans = ({user,setUser}) => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState('#242631');
  
  let logoGameWidth = '15vw'
  
  var mobile = false;

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

  
  return (
    <>
    {false ? <FullscreenComponent/> :
    <>
    <ToastContainer />
    <div type = "mega">
      <div className = "headline">
      <header>
        <a className="logo-div" href ="https://playnarrator.com">
        <img className="logo" src ={logoImage} ></img>
          </a>


       
      </header>

        <div>
        <SubscriptionColumns auth={auth} user={user} setUser={setUser} provider={provider} mobile={mobile}/>
        </div>
        
        </div>

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
        {`We use cookies to enable session and login tracking. These are necessary for the game to work right, but you can block them in your browser settings. 

       If you're on a free account, we use Google Adsense for ads. They collect some data as well. For questions, see our FAQ, privacy policy, or ask about it on discord.`} 
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


export default Plans;
