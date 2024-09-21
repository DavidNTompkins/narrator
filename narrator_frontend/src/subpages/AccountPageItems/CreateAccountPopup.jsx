import React, { useState, useEffect } from 'react';
import logoImage from '../../img/logo.png'
import { signInWithRedirect,signInWithPopup, signOut,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import './CreateAccountPopup.css'
import LoginParts from './LoginParts.jsx'
import RegisterParts from './RegisterParts.jsx'


function CreateAccountPopup({auth, user, setUser, provider, startInRegister}) {
  const [isLogin, setIsLogin] = useState(startInRegister ? false : true);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  
  return (
    <div onKeyDown={handleKeyDown} 
      style={{
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
      }}>
        <img className="LoginBlocker-logo" src ={logoImage}></img>
        <h2 style={{color:'#b4ecee'}}>{isLogin ? 'Login to your Account' :'Register for an Account'}</h2>
        <div className="LoginBlock-switchDiv">
        <button type="button" className="LoginBlock-switchRegister" onClick={() => setIsLogin(!isLogin)}>
          
          {isLogin ? 'Need an account? Register here' : 'Have an Account? Login here'}
        </button>
        </div>
       <>
         <div style={{maxWidth:'350px',textAlign:'left'}}>
   {isLogin ? (
          <LoginParts auth={auth} provider={provider} />
        ) : (
          <RegisterParts auth={auth} provider={provider} />
        )}
        </div>
    <div className="links">
      <a href="/terms">Terms</a>
      <a href="/FAQ">FAQ</a>
      <a href="/privacy">Privacy</a>
    </div>
  </>
    </div>
      </div>
  );
}

export default CreateAccountPopup;
