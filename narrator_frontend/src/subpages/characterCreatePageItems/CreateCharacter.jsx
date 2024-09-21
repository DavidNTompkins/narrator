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
//import { db } from './firebase'; // Import your Firebase configuration
//import CharacterCard from './CharacterCard'; // Import your CharacterCard component

    


//formed off duplicate of explorepage
const CreateCharacter = ({user,setUser}) => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState('#242631');
  const [yourCharacters, setYourCharacters] = useState([]);
  const [popularCharacters, setPopularCharacters] = useState([]);

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


  if (window.innerWidth <= 768) { 
    mobile = true;
    /*document.addEventListener('contextmenu', function (e) {
      // stop long touch hold from popping up context menus
      e.preventDefault();
  })*/};
  logoGameWidth = mobile ? '33vw':'15vw'


        useEffect(() => {
          // Fetch 'Your Characters'
          const fetchYourCharacters = async () => {
            const snapshot = await db.collection('characters/userID').get();
            setYourCharacters(snapshot.docs.map(doc => doc.data()));
          };

          // Fetch 'Popular Characters'
          const fetchPopularCharacters = async () => {
            const snapshot = await db.collection('/publicCharacters').get();
            setPopularCharacters(snapshot.docs.map(doc => doc.data()));
          };

          fetchYourCharacters();
          fetchPopularCharacters();
        }, []);

        return (
          <div>
            {true && (
              <div className="modal">
                <h2>Title</h2>
                <button onClick={() => {/* Handle new character creation */}}>Create New Character</button>

                <div className="horizontal-scroll right-to-left">
                  {yourCharacters.map(character => <CharacterCard key={character.id} {...character} />)}
                </div>

                <div className="horizontal-scroll left-to-right">
                  {popularCharacters.map(character => <CharacterCard key={character.id} {...character} />)}
                </div>
              </div>
            )}
            
          

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
            </div>
    
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


export default CreateCharacter;
