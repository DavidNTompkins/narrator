import React, { useState, useEffect } from 'react';
import logoImage from './img/logo.png'
import { signInWithRedirect,signInWithPopup, signOut,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import CreateAccountPopup from './subpages/AccountPageItems/CreateAccountPopup.jsx';

import './LoginBlocker.css'
import { useNavigate } from 'react-router-dom';



function NoAccountBlocker({auth, user, setUser, provider}) {
  const navigate = useNavigate();
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
const [hasUnusedMonth, setHasUnusedMonth] = useState(false);

  const [showLoginBlocker, setShowLoginBlocker] = useState(false);

  const navigateToLink = () => {
    navigate('/plans');
  };

  
  

  const handleCheckout = () => {
    window.location.href = '/plans';
  };

  const goToAccount = () => {
    window.location.href = '/account';
  };
  const setLoginBlockerTrue = () => {
    setShowLoginBlocker(true);
  }

  return (
    <>
      {false && !user ? <CreateAccountPopup auth={auth} user={user} setUser={setUser} provider={provider} startInRegister={true} /> :
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
        <h2 style={{color:'#b4ecee',marginTop:"7px"}}>Welcome to Narrator!</h2>
        {!user && <p className="clickable-span-login" onClick={()=>setShowLoginBlocker(true)}>This page requires an account. Already have an account? Click here.</p>
        }
        <div>
          <hr></hr>
          <p style={{color:'#b4ecee'}}>We're closing soon and aren't taking any new subscriptions. Thanks for coming by!</p>
         
               
          
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

const TierCard = ({ title, bulletPoints, onClick}) => {
  return (
    <div className="tier-card-div" onClick={onClick}>
      <h2>{title}</h2>
      <ul>
        {bulletPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};



export default NoAccountBlocker;
