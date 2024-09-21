import React, { useState, useEffect } from 'react';
import logoImage from '../../img/logo.png';
import farewellImage from '../../img/farewell.png'; // Add this import
import { FaTwitter, FaDiscord } from 'react-icons/fa'; // Add this import
import '../../LoginBlocker.css';
import { useNavigate } from 'react-router-dom';

function NewPlayerModal({auth, user, setUser, provider, closeBlocker}) {
  const navigate = useNavigate();
  const [showLoginBlocker, setShowLoginBlocker] = useState(false);

  return (
    <>
      <div onClick={closeBlocker} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          zIndex: 9999,
        }}>
        <div style={{
          backgroundColor: 'black',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #b4ecee',
          color: '#000',
          boxShadow: '0 4px 8px 0 #007a7a, 0 6px 20px 0 #007a7a',
          overflowY: 'auto',
          maxHeight:'75vh',
          maxWidth:'500px',
          scroll:'auto',
        }}>
          <img className="LoginBlocker-logo" src={logoImage} alt="Logo" />
          <h2 style={{color:'#b4ecee', marginTop:"7px", margin:'auto'}}>Narrator is closing soon!</h2>
          <div>
            <hr />
            <img src={farewellImage} alt="Farewell" style={{maxWidth: '100%', height: 'auto'}} />
            <p style={{color:'#b4ecee', overflow:'wordwrap'}}>
              Thanks for playing! It means a lot to me that you all played this game! We're shutting down and are taking no new subscriptions. Any existing subscriptions have been cancelled and you won't be charged again. You can download your games from the editing window. If you have any questions or need help, email me at david@playnarrator.com.
            </p>
            <p style={{color:'#b4ecee', overflow:'wordwrap'}}>
              I'm not sure what comes next, but if you'd like to keep in touch, I'm on twitter, or you could just stay in the playnarrator discord. I'll ping that the next time I make something. Thanks again!
            </p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px'}}>
              <a href="https://twitter.com/davidntompkins" className="farewell-button startButton" >
                Follow me on X
              </a>
              <a href="https://discord.gg/KhRHNerQjj" className="farewell-button startButton" style={{display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#7289DA', color: 'white', textDecoration: 'none', borderRadius: '5px'}}>
                <FaDiscord style={{marginRight: '5px'}} /> Join the discord
              </a>
            </div>
          </div>
          <hr />
          <div className="links" style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px'}}>
            <a href="/terms">Terms</a>
           
            <a href="/privacy">Privacy</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPlayerModal;