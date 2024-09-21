import React, { useState, useEffect } from 'react';
import logoImage from './img/logo.png'
import { signInWithRedirect,signInWithPopup, signOut,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import CreateAccountPopup from './subpages/AccountPageItems/CreateAccountPopup.jsx';

import './LoginBlocker.css'

import { db } from './smallScripts/firebaseConfig.js'; // Your Firestore config


function SubscriptionBlocker({auth, user, setUser, provider}) {
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
const [hasUnusedMonth, setHasUnusedMonth] = useState(false);

  const [showLoginBlocker, setShowLoginBlocker] = useState(false);

  /*useEffect(() => {
    // Fetch user data from Firestore
   const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const freeMonths = userData.freeMonths || [];

          // Check for any unused freeMonths
          const unusedFreeMonth = freeMonths.some(fm => !fm.used && !fm.active);
          setHasUnusedMonth(unusedFreeMonth);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchData();
  }, [user]); */



  const handleCheckout = () => {
    window.location.href = '/plans';
  };

  const goToAccount = () => {
    window.location.href = '/account';
  };

  
  return (
    <>
      {showLoginBlocker && !user ? <CreateAccountPopup auth={auth} user={user} setUser={setUser} provider={provider} /> :
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
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
      scroll:'auto',
      }}>
        <img className="LoginBlocker-logo" src ={logoImage}></img>
        <h2 style={{color:'#b4ecee',marginTop:"7px"}}>A subscription is required to create and continue games.</h2>
        {!user && <p className="clickable-span-login" onClick={()=>setShowLoginBlocker(true)}>Already have an account? Click here.</p>
        }
        <div>
          {hasUnusedMonth && <>
            <div className="free-month-alert" >
          <p><strong> Hey! You have a free month! Go Claim it</strong></p>
              <button onClick={goToAccount}>Go to Account</button>
              </div>
            <hr></hr>
          </>}
          
          <div className="premium-tier-blocker" style={{textAlign:'left'}}>
      <img src="/image_assets/coin_icon.png"  alt="Gold Tier Icon" />
      <h2>Become a Supporter</h2>
      
      <hr style={{backgroundColor:'#ffd700', border:'none', height:'1px', width:'90%'}}></hr>
            <p style={{marginBottom:0,textAlign:'left'}}>Support and get all these:</p>
      <ul>
        <li>Custom Game Creation</li>
        <li>Custom Image Generation</li>
        <li>Save and continue games</li>
        
        <li>Supports continued development</li>
      
        <br></br>
      </ul>
      <div className="subscription-footer">
      <p><strong>$9.99/month</strong></p>
         <p className="subscribe-text" style={{fontSize:'12px',marginTop:'2px',marginBottom:'4px'}}>1-week Free Trial</p>
      <button onClick={handleCheckout}>More Details</button>
     
  
        
    </div>
      </div>
        <hr></hr>
          
   <>
    <div className="links">
      <a href="/terms">Terms</a>
      <a href="/FAQ">FAQ</a>
      <a href="/privacy">Privacy</a>
    </div>
  </>
    </div>
      </div>
      </div>}
    </>
  );
}

export default SubscriptionBlocker;
