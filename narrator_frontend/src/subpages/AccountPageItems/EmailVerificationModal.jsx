import React, { useState, useEffect } from 'react';
import { getAuth, updateEmail, sendEmailVerification, reload } from "firebase/auth";
import './EmailVerificationModal.css';

async function updateAndVerifyEmail(newEmail) {
  const auth = getAuth();
  try {
    // Update the email
    await updateEmail(auth.currentUser, newEmail);
    // Send verification email
    await sendEmailVerification(auth.currentUser);
    // Reload the user to refresh the verification status
    await reload(auth.currentUser);
  } catch (error) {
    console.error("Error updating email: ", error);
  }
}

const EmailVerificationModal = ({ setShowModal }) => {
  const [newEmail, setNewEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUserEmail(user.email);
    }
  }, []);

  const handleVerifyCurrentEmail = async () => {
    try {
      const auth = getAuth();
      await sendEmailVerification(auth.currentUser);
      alert("Verification email sent to your current email address!");
      setShowModal(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUpdateEmail = async () => {
    const confirmUpdate = window.confirm("Are you sure you want to update your email address? \n You will use the new email to login.");
    if (confirmUpdate) {
      try {
        await updateAndVerifyEmail(newEmail);
        alert("Verification email sent to your new email address!");
        setShowModal(false);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };
  return (
    <div className="verification-modal-overlay">
      <div className="verification-modal">
        <h2>Verify Your Email</h2>
        
        {!showUpdateForm ? (
          <>
            <p className="verification-text">You'll need to verify your email to create games.</p>
            <p className="verification-text">(if you just verified, wait a few seconds and try again)</p>
            <p className="verification-text">Your current email is: <strong>{currentUserEmail}</strong></p>
            <br/>
            <button className="LoginBlock-emailLoginButton" onClick={handleVerifyCurrentEmail}>Verify Current Email</button>
            <button className="LoginBlock-emailLoginButton" onClick={() => setShowUpdateForm(true)}>Update Email</button>
          </>
        ) : (
          <>
            <p className="verification-text">CAREFUL! Updating your email here will change the email you log in with.</p>
            <p className="error-message">{errorMessage}</p>
            <input 
              type="email" 
              placeholder="Enter new email" 
              value={newEmail} 
              className="modal-input"
              onChange={(e) => setNewEmail(e.target.value)} 
            />
            <br/>
            <button className="LoginBlock-emailLoginButton" onClick={handleUpdateEmail}>Update and Verify New Email</button>
          </>
        )}
        <button className="LoginBlock-recoverEmailButton" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
