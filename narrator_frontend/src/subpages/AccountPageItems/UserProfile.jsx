import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 
import EditProfile from './EditProfile';
import SubscriptionStatus from './SubscriptionStatus';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import FreeMonthsComponent from './FreeMonths.jsx'



function UserProfile({ userId }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const successfulReferrals = userProfile?.successfulReferrals || 0;
  const creationDate = userProfile?.creationDate || new Date().toISOString(); // Replace with a default value if necessary


  const isAccountOlderThanAWeek = (creationDate) => {
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const accountTime = new Date(creationDate).getTime();
    
    return (currentTime - accountTime) >= oneWeekInMilliseconds;
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchUserProfile();
  }, [userId]);


   // checking if user has verified email
  useEffect(() => {
  const auth = getAuth();
  // Subscribe to auth changes
  const unsubscribe = auth.onAuthStateChanged(user => {
    setIsVerified(user?.emailVerified || false);
  });
  // Cleanup subscription
  return () => {
    unsubscribe();
  };
}, []);
  
    const sendVerificationEmail = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        alert("Verification email sent!");
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    }
  };
  
  let betaMessage;

  if(userProfile){
  switch(userProfile.status) {
    case 'betaTesters_wave2':
      betaMessage = 'You were one of the earliest beta testers! Thanks for joining me in this!';
      break;
    case 'betaTesters_wave1_0628':
      betaMessage = 'You were one of the earliest beta testers! Thanks for joining me in this!';
      break;
    default:
      betaMessage = '';
  }
  }

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-block">
      <h1>Account Information</h1>
      {userProfile.status && <p>{betaMessage}</p>}
      <hr></hr>
      <p><strong>Username:</strong> {userProfile.name ? userProfile.name : 'Name not yet set'}</p>
      
      <p><strong>Email:</strong> {userProfile.email}</p>
      {isAccountOlderThanAWeek(creationDate) && (successfulReferrals < 8) ? 
        <p><strong>Promo Code:</strong> {userProfile.promoCode}</p> : 
        successfulReferrals >= 8 ? 
          <p><strong>Promo Code:</strong> You're maxed out on free months!</p> : 
          <p><strong>Promo Code:</strong> Your account is new! Promo codes only available after a week.</p>
      }
      <p style={{marginTop:0, marginBottom:0,fontSize:'0.8em'}}>(Give your promo code to people you introduce to the game)</p>
      <hr></hr>
      <SubscriptionStatus userProfile={userProfile} />
      <FreeMonthsComponent userID={userId} />
      {!isVerified && (
      <>
        <hr></hr>
        <p>Your email is not yet verified - click to send a new email.</p>
        <button onClick={sendVerificationEmail}>Send Verification Email</button>
        <hr></hr>
      </>
    )}
      
      
      <EditProfile userProfile={userProfile} userId={userId} />
    </div>
  );
}

export default UserProfile;
