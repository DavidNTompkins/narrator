import React, { useState, useEffect } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { signInWithRedirect,signInWithPopup, signOut,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification  } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, getDoc, setDoc, doc } from 'firebase/firestore';
import './Login.css'; 
import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton.jsx"
import CreateAccountPopup from '../subpages/AccountPageItems/CreateAccountPopup.jsx'


export default function Login({ user, setUser, auth, provider }) {
  const [showMenu, setShowMenu] = useState(false);
  const [adventures, setAdventures] = useState([]);
  const [selectedAdventure, setSelectedAdventure] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleAdventureClick = (adventure) => {
    navigate(`/adventure/${adventure.adventureID}`);
    window.location.reload();

};
  const goToAccount = () => {
    navigate('/account');
  };
/*const registerWithEmailPassword = async () => {
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
}; */

 
  useEffect(() => {
    if (user) {
      const fetchAdventures = async () => {
        const db = getFirestore();
        const q = query(collection(db, 'adventures'), where('userID', '==', user.uid));

        const querySnapshot = await getDocs(q);
        const fetchedAdventures = [];
        querySnapshot.forEach((doc) => {
          fetchedAdventures.push(doc.data());
        });
    const sortedAdventures = fetchedAdventures.sort((a, b) => {
    return a.adventureName.localeCompare(b.adventureName);
    });

        setAdventures(sortedAdventures);
      };

      fetchAdventures();
    } else {
      setAdventures([]);
    }
  }, [user]);

 /*const signInWithGoogle = () => {
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
}; */


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const loggedInText = user ? 'You are logged in' : 'Not logged in';

  const updateAdventuresList = (adventureId) => {
    setAdventures((prevAdventures) => {
      return prevAdventures.filter(adventure => adventure.adventureID !== adventureId);
    });
  }
  
  
  return (
    <div className="loginButtonContainer">
      <div className="loginButton" onClick={toggleMenu}>
        
        <FaUserAlt size={40} style={{ color: user != null ? null : 'gray' }} />
        {!user && <p type="optionstext" style={{color:'#b4ecee'}}>LOGIN</p>}
      </div>
      {showMenu && (
      <>
        {!user && <CreateAccountPopup auth={auth} user={user} setUser={setUser} provider={provider} />}
        
        <div className="popupMenu">
          <button className="closeMenuButton" onClick={closeMenu}>
            X
          </button>
          <p>{loggedInText}</p>
          <button className="googleLogin" onClick={goToAccount}>Visit Account</button>
          {!user && <p>Log in to save and publish games.</p>}
          {user && (
            <div className="adventureList">
              <h5>Your Saved Adventures</h5>
              {adventures.length==0 && <p>No adventures found. Your saved games will appear here.</p>}
              {adventures.map((adventure, index) => (
              <>
                <div key={index} className="adventureListItem"
                   onClick={() => handleAdventureClick(adventure)}>
                  <p className="save-game-title"><strong>{adventure.adventureName}</strong></p>
                  <div className="adventure-delete-button">
                    <DeleteButton adventure={adventure} userId={user.uid} updateAdventuresList={updateAdventuresList} />
                  </div>
                  <p className="save-game-names">{`Playing as: ${adventure.adventureFormData.name1}`}</p>
                  
                </div>
              </>
              ))}
            </div>
        
          )}
          {user && (
  <button className="googleLogin" onClick={handleSignOut}>Logout</button>
)}

        </div>
      </>
      )}
    </div>
  );
}
