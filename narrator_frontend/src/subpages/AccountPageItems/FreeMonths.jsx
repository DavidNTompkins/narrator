import React, { useState, useEffect } from "react";
import { getDoc,getFirestore, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";

const FreeMonthsComponent = ({userID}) => {
  const [freeMonths, setFreeMonths] = useState([]);
  const [referrees, setReferrees] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [activating, setActivating] = useState(false);
  const [userRefresh, setUserRefresh] = useState(0);
  const db = getFirestore();
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  
  const userDocRef = doc(db, "users", userID);

  useEffect(() => {
    const fetchData = async () => {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setFreeMonths(userDoc.data().freeMonths);
        setReferrees(userDoc.data().successfulReferrals);
      }
    };

    fetchData();
  }, [userRefresh]);

  const isInFreeMonth = (startDate) => {
  if (!startDate) return false;
  const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  const now = new Date().getTime();
  return now - startDate.toMillis() < oneMonthInMilliseconds;
};

    
  const activateFreeMonth = async () => {
  setActivating(true);
    try {
      console.log(userID);
      const response = await fetch(`${api_url}promo/activate-free-month`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userID }),
      });

      const data = await response.json();

      if (data.success) {
        // Do something, like updating the UI or showing a success message
      }
    } catch (error) {
      // Handle error
      console.error("Couldn't activate the free month:", error);
    }
    setShowPopup(false);
    setActivating(false);
    setUserRefresh(1);
  };

    


  return (
  <div>
    <hr/>
    <h2>Your Free Months</h2>
    
    {referrees > 0 ? (
        <p>You've referred {referrees} people to this game! Thank you! For every 2 referrals, you'll earn a free month (up to 4 months).</p>
      ) : (
        <p>For every 2 referrals, you'll earn a free month (up to 4 months).</p>
      )}
      
      {freeMonths && freeMonths.length > 0 ? (
        freeMonths.map((month, index) => (
          <div key={index} style={{ display: 'inline-block', position: 'relative' }}>
            {/* Unused free month */}
            {!month.used && !month.active && (
              <img
                className="free-month-coin-gold"
                src="/image_assets/coin_icon.png"
                alt="Free Month"
                onClick={() => {
                  setSelectedMonth(month);
                  setShowPopup(true);
                }}
              />
            )}
            {/* Active and in free month */}
            {month.active && isInFreeMonth(month['start-date']) && (
          <div style={{ display: "inline-block", position: 'relative', width: '40%' }}>
            <img
              className="free-month-coin-active"
              src="/image_assets/coin_icon.png"
              alt="Active Free Month"
              style={{ width: '100%' }}
            />
            <div className='active-bar' >ACTIVE</div>
          </div>
        )}
            {/* Used but no longer active */}
            {month.used && (!month.active || !isInFreeMonth(month['start-date'])) && (
              <div>
                <img
                  className="free-month-coin"
                  src="/image_assets/coin_icon.png"
                  alt="Used Free Month"
                  style={{filter: "grayscale(50%)"}}
                />
                <div className='used-bar' >USED</div>
              </div>
            )}
          </div>
        ))
      ) : null}

    {Array.from({ length: 4 - (freeMonths ? freeMonths.length : 0) }, (_, index) => (
      <div key={`placeholder-${index}`} style={{display:'inline'}}>
        <img
          src="/image_assets/coin_icon.png"
          className="free-month-coin"
          alt="Empty Slot"
          style={{ filter: "grayscale(100%)"}}
          title="Refer friends to earn free months!"
        />
      </div>
    ))} 

    {showPopup && (
  <div className="freemonth-popup">
    <div className="freemonth-popup-content">
      {activating ? (
        <p>Activating your free month now! Please wait just a second...</p>
      ) : (
        <>
          <p style={{wordwrap:true}}>Thanks for playing! Once activated, you'll have a full subscription for a month from today. If you're in a free month right now - wait for that to end before activating! If you're already subscribed, this applies a 100% discount on your next month. Let me know if anything goes wrong and I'll make it right.</p>
          <button className="freemonth-popup-content-cancel-button" onClick={() => setShowPopup(false)}>Cancel</button>
          <button className="freemonth-popup-content-button" onClick={() => activateFreeMonth(selectedMonth)}>Activate</button>
          
        </>
      )}
    </div>
  </div>
)}
  </div>
);

};

export default FreeMonthsComponent;
