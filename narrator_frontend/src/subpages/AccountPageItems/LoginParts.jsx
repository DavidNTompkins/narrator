import React, { useState, useEffect } from 'react';
import { signInWithRedirect,signInWithPopup, signOut,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

function LoginParts({ auth, provider }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

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
     console.log('attempting google signin')
    signInWithPopup(auth, provider)
      .then(async (userCredential) => {
        console.log('signed in'); 
        var user = userCredential.user;
        const db = getFirestore();
        console.log('db gotten');
        const userDoc = doc(db, 'users', user.uid);
        console.log('userdoc made');
        const docSnap = await getDoc(userDoc);
        console.log('doc gotten');

        if (!docSnap.exists()) {
          console.log('new user')
           const couponId = await fetch(`${api_url}securityCheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.uid, // pass the user ID for verification if needed
      }),
    }).then((res) => res.json())
     // .then((data) => data.couponId); // Assume the returned object has a 'couponId' field
          // If the document does not exist, it's a new user, so we set the status field
          await setDoc(userDoc, {
            email: user.email,
              status: 'post_beta',
              name: '',
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
    <button type="button" className="LoginBlock-emailLoginButton" onClick={loginWithEmailPassword}>
      Login
    </button>
      </div>
    <button type="button" className="LoginBlock-recoverEmailButton" onClick={recoverPassword}>Recover Password</button>
    <hr></hr>
    <button type="button" className="LoginBlock-googleLoginButton" onClick={signInWithGoogle}>Login with Google</button>

  </>
    );
}

export default LoginParts;