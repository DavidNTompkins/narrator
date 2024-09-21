import React, { useState, useEffect } from 'react';
import logoImage from './img/logo.png'
import { signInWithRedirect,signInWithPopup, signOut,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification  } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs,getDoc, setDoc, doc } from 'firebase/firestore';
import './LoginBlocker.css'


function LoginBlocker({auth, user, setUser, provider,startInRegister}) {
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


   
const registerWithEmailPassword = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('user created');
    const user = userCredential.user;
    await sendEmailVerification(user);
    alert('Verification email sent! Confirm it to continue using your account.');

    const db = getFirestore();
    console.log('db gotten');
    const userDoc = doc(db, 'users', user.uid);
    console.log('userdoc made');
    const docSnap = await getDoc(userDoc);
    console.log('doc gotten');
    
    if (docSnap.exists()) {
      console.error('A user with this ID already exists.');
      setErrorMessage('Conflicting account found - try reloading the page?');
      return;
    }

    try {
      console.log('attempting to set');
      await setDoc(userDoc, {
        email: user.email,
        status: 'betaTesters_wave2',
      });
      console.log('User document successfully written!');
    } catch (error) {
      console.error('Error writing user document:', error);
    }

    setEmail('');
    setPassword('');
    setErrorMessage('');

  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Error creating account: Code - ${errorCode}, Message - ${errorMessage}`);
    setErrorMessage(getErrorMessage(error.code));
  }
};


const loginWithEmailPassword = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    setEmail('');
    setPassword('');
    setErrorMessage('');
  } catch (error) {
    console.error('Error logging in:', error);
    setErrorMessage(getErrorMessage(error.code));
  }
};
  const recoverPassword = async () => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password recovery email sent. Please check your inbox.');
  } catch (error) {
    console.error('Error sending password recovery email:', error);
  }
};
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'The user account has been disabled.';
    case 'auth/user-not-found':
      return 'User not found.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'The email address is already in use.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    default:
      return 'An unknown error occurred.';
  }
};
  
  const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(async (userCredential) => {
      // User signed in 
      var user = userCredential.user;
      
      // Get a reference to Firestore
      const db = getFirestore();

      // Create a document reference for the user in the 'users' collection with the same id as the user's uid
      const userDoc = doc(db, 'users', user.uid);

      // Check if a document for the user already exists
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        // If the document does not exist, it's a new user, so we set the status field
        await setDoc(userDoc, {
          email: user.email,
          status: 'betaTesters_wave2'
        })
        .then(() => {
          console.log("User document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing user document: ", error);
        });
      } else {
        // If the document exists, it's an existing user, so we only update the email field (or any other fields except status)
        console.log("Existing user signed in!");
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
  //signInWithRedirect(auth, provider); // old method
};

  
  return (
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
      }}>
        <img className="LoginBlocker-logo" src ={logoImage}></img>
        <h2 style={{color:'#b4ecee'}}>Log in to create and save games.</h2>
       <>
    <p className="error-message">{errorMessage}</p>
    <input
      type="email"
      placeholder="Email"
      value={email}
      className="loginBlock-input"
      onChange={(e) => setEmail(e.target.value)}
      style={{
        maxWidth:'300px',
        backgroundColor: '#003333',
        color: '#b4ecee',
        border:'1px solid #b4ecee',
        padding:'0.4em',
        marginBottom: '0.8em',
      }}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      className="loginBlock-input"
      onChange={(e) => setPassword(e.target.value)}
      style={{
        maxWidth:'300px',
        backgroundColor: '#003333',
        padding:'0.4em',
        color: '#b4ecee',
        border:'1px solid #b4ecee',
        marginBottom: '0.8em',
      }}
    />
    <div className="LoginBlock-LoginButtons">
    <button type='text' className="LoginBlock-emailLoginButton" onClick={loginWithEmailPassword}>
      Login
    </button>
    <button type='text' className="LoginBlock-emailLoginButton" onClick={registerWithEmailPassword}>
      Register
    </button>
      </div>
    <button type='text' className="LoginBlock-recoverEmailButton" onClick={recoverPassword}>Recover Password</button>
    <hr></hr>
    <button type='text' className="LoginBlock-googleLoginButton" onClick={signInWithGoogle}>Login with Google</button>
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

export default LoginBlocker;
