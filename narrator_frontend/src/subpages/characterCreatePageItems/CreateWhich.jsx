import './CreateWhich.css'; // Import the CSS for styling
import { useLocation } from 'react-router-dom';
import React, { useState,useCallback, useEffect,useRef } from 'react';
import '../AdventurePage.css'
import logoImage from '../../img/logo.png'
//import getBrowser from '../getBrowser.js'
import { auth, provider } from '../../smallScripts/firebaseConfig';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy, limit,  startAfter } from 'firebase/firestore';
import {trackPageView,trackEvent} from '../../smallScripts/analytics.js'
import CookieConsent from 'react-cookie-consent'
import { CSSTransition, TransitionGroup } from 'react-transition-group';


//formed off duplicate of explorepage
const CreateWhich = ({user,setUser}) => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState('#242631');

  let logoGameWidth = '15vw'

  const clickCharacter = () => {
    window.location.href = '/create-character';
  };
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
    <div type = "mega">
      <div className = "headline">
      <header>
        <a className="logo-div" href ="https://playnarrator.com">
        <img className="logo" src ={logoImage} ></img>
          </a>

      </header>

        <div>
          
              <div className="create-which-modal">
                <div className="create-which-modal-content">
                  <div className="create-which-section" onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#007a7a'}
                                         onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#004040'} onClick={clickCharacter}>
                    <h2>Create A Character</h2>
                    <p>For chat, roleplay, and more</p>
                    <img className="create-which-image" src="image_assets/create/characterChat.webp" alt="Create Character" />

                  </div>
                  <div className="create-which-section" onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#007a7a'}
                                         onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#004040'}>
                    <h2>Create An Adventure</h2>
                    <p>For classic roleplay adventures</p>
                  </div>
                </div>
              </div>
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


export default CreateWhich;
