import React, { useEffect, useState } from 'react';
import { db } from '../smallScripts/firebaseConfig'; // Import your Firebase config
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';


/* use subscription to check for gold */

const FeatureControl = ({ user, children }) => {
  const [isEligible, setIsEligible] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeStatus, setPromoCodeStatus] = useState('');

  useEffect(() => {
    checkEligibility();
    console.log(isEligible);
  }, [user]);

  const checkEligibility = async () => {
    
        console.log(hasDailyUse)
        setIsEligible(true);
        console.log('approved')

        return;
      }

  // Passed to child for incrementing
  const incrementUsage = async () => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
  
    if (docSnap.exists()) {
      let { totalUses =0, extraUsages = 0, lastUse, subscriptionType } = docSnap.data();
      const today = new Date().toISOString().split('T')[0];
      const hasDailyUse = (subscriptionType=="price_1NsRwKKzLimNb9ksPYEtiTIR") && (!lastUse || lastUse?.split('T')[0] === today);
    
  
      totalUses += 1; // Increment total uses
  
      // Update lastUse to today's date in ISO string format
      lastUse = new Date().toISOString();
  
      // Logic for handling extraUsages increment
      if (totalUses >= 2 && hasDailyUse) {
        extraUsages -= 1; // Only increment extraUsages under specific conditions
      }
  
      // Update Firestore document with the new totalUses, extraUsages, and lastUse
      await updateDoc(userRef, {
        totalUses,
        extraUsages,
        lastUse // Update this field to reflect the most recent use
      });
    }
  };
  
  
  // have it make request to server to try promo code

  const handlePromoCodeSubmit = async () => {
    const userRef = doc(db, 'users', user.uid);
    const promoCodeRef = doc(db, 'promoCodes', promoCode);
    const docSnap = await getDoc(userRef);
    const promoCodeSnap = await getDoc(promoCodeRef);
  
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const { promoCodesUsed = [], extraUsages = 0 } = userData;
  
      if (promoCodesUsed.includes(promoCode)) {
        setPromoCodeStatus('This promo code has already been used.');
      } else if (!promoCodeSnap.exists() || !promoCodeSnap.data().valid) {
        setPromoCodeStatus('This promo code is not valid.');
      } else {
        // Assuming the benefit is an extra usage
        await updateDoc(userRef, {
          promoCodesUsed: arrayUnion(promoCode),
          extraUsages: extraUsages + promoCodeSnap.data().uses, // Increment extra usages
        });
        setPromoCodeStatus('Promo code accepted. You have an additional usage!');
        checkEligibility(); // Re-check eligibility
      }
    } else {
      setPromoCodeStatus('Error: User data not found.');
    }
  };
  
  

  return (
    <>
       {isEligible ? (
      // Use React.cloneElement to add incrementUsage as a prop to children
      React.Children.map(children, child => 
        React.cloneElement(child, { incrementUsage })
      )
    ) : (
        <>
        {!isOpen ? (
          <button type="button" className="startButton" style={{marginRight:'10px'}}onClick={()=>{setIsOpen(true)}}>Open Adventure Video</button>

        ):(
        
          <>
          <p>You're not eligible to use the video generator right now. Gold Tier subscribers can create a video each day.</p>
          <div>
            <p>Have a promo code?</p>
            <input
              type="text"
              value={promoCode}
              style={{maxWidth:'150px',marginRight:'5px'}}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
            />
            <button type="button" onClick={handlePromoCodeSubmit}>Submit</button>
          </div>
          {promoCodeStatus && <p>{promoCodeStatus}</p>}
          </>
          )}
        </>
      )}
    </>
  );
};

export default FeatureControl;
