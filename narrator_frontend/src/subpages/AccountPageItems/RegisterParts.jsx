import React, { useState, useEffect } from 'react';
import { signInWithRedirect,signInWithPopup, signOut,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification  } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs,getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';


function RegisterParts({auth, provider}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [playerUsername, setPlayerUsername] = useState('');
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';


  
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
  
   
const registerWithEmailPassword = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('user created');
    const user = userCredential.user;
    await sendEmailVerification(user);
    

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
    const couponId = await fetch(`${api_url}securityCheck`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.uid, // pass the user ID for verification if needed
    }),
  }).then((res) => res.json())
    //.then((data) => data.couponId); // Assume the returned object has a 'couponId' field


    try {
      console.log('attempting to set');
      await setDoc(userDoc, {
        email: user.email,
        status: 'post_beta',
        name: playerUsername,
        promoCode:couponId.code,
        promoReferenceCode:couponId.id,
        creationDate:serverTimestamp(),
      });
      console.log('User document successfully written!');
    } catch (error) {
      console.error('Error writing user document:', error);
    }
    alert('Verification email sent! Confirm it to continue using your account.');
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

  const signInWithGoogle = () => {
    if (!playerUsername.trim()) {
    setErrorMessage('Username is required.');
    return;
  }
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
         const couponId = await fetch(`${api_url}securityCheck`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.uid, // pass the user ID for verification if needed
    }),
  }).then((res) => res.json())
    //.then((data) => data.couponId); // Assume the returned object has a 'couponId' field
        // If the document does not exist, it's a new user, so we set the status field
        await setDoc(userDoc, {
          email: user.email,
            status: 'post_beta',
            name: playerUsername,
            promoCode:couponId.code,
            promoReferenceCode:couponId.id,
            creationDate:serverTimestamp(),
        })
        .then(() => {
          console.log("User document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing user document: ", error);
        });
      } else {
        // If the document exists, it's an existing user, we do nothing
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
    <>
          <p className="error-message">{errorMessage}</p>
      <input
        type="other"
        placeholder="Player Username"
        value={playerUsername}
        className="loginBlock-input"
        onChange={(e) => setPlayerUsername(e.target.value)}
        style={{
          maxWidth:'40%',
          backgroundColor: '#003333',
          color: '#b4ecee',
          border:'1px solid #b4ecee',
          padding:'0.4em',
          marginBottom: '0.8em',
        }}
      />
      <br></br>
    <input
      type="email"
      placeholder="Email"
      value={email}
      className="loginBlock-input"
      onChange={(e) => setEmail(e.target.value)}
      style={{
        maxWidth:'40%',
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
        maxWidth:'40%',
        backgroundColor: '#003333',
        padding:'0.4em',
        color: '#b4ecee',
        border:'1px solid #b4ecee',
        marginBottom: '0.8em',
        marginLeft:'3px',
      }}
    />
        
    <div className="LoginBlock-LoginButtons">
    <button type="button" className="LoginBlock-emailLoginButton" onClick={registerWithEmailPassword}>
      Register
    </button>
      </div>
    <hr></hr>
    <button type="button" className="LoginBlock-googleLoginButton" onClick={signInWithGoogle}>Register with Google</button>
  </>
  );
}

export default RegisterParts;