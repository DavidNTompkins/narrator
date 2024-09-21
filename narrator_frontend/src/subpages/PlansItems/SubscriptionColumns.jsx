import {React, useState, useEffect} from 'react';
import './SubscriptionColumns.css';
import CreateAccountPopup from '../AccountPageItems/CreateAccountPopup.jsx'
import { loadStripe } from '@stripe/stripe-js';

const FreeTier = ({mobile}) => {

  const fartSounds = [
    'fart1.mp3',
    'fart2.mp3',
    'fart3.mp3',
    'fart4.mp3',
    'fart5.mp3',// Add more file names here
  ];
const playFartSound = () => {
    const randomIndex = Math.floor(Math.random() * fartSounds.length);
    const randomFartSound = fartSounds[randomIndex];
    const fartSound = new Audio(`/audio/farts/${randomFartSound}`);
  
    fartSound.play();
  
  };
  return (
    <div className={mobile ? "free-tier-mobile":"free-tier"}>
      <img src="/image_assets/freetier.png"  alt="Free Tier Icon" />
      <h2>Free Tier</h2>
      <h2>The Novice</h2>
      <hr style={{backgroundColor:'rgb(184, 115, 51)', border:'none', height:'1px',width:'90%'}}></hr>
      <ul>
        <li>Perfect for trying Narrator</li>
        <li>No image generation</li>
        <li>Limited model controls</li>
        <li>Ad supported</li>
        <li>No creating or continuing games</li>
      </ul>
      <div className="subscription-footer">
      <p>Price: $0.00</p>
      <button onClick={playFartSound}>Free Mystery Button</button>
        <p className="subscribe-text" style={{fontSize:'10px',marginTop:'6px',marginBottom:'4px'}}>Click at your own risk!</p>
      </div>
      </div>
  );
};

const GoldTier = ({auth, user, setUser, provider, mobile}) => {
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';
  const [showPopup, setShowPopup] = useState(false);
  const [working, setWorking] = useState(false);
  
  const stripeRedirect = async (userID) => {
    setWorking(true);
    const stripe = await loadStripe('pk_live_51MuNJaKzLimNb9ks9sObFlOonJitH66vXp466sXmUepKGXmMyKYruzroxtnqsCAKE2WNUH8BtK9JJI90BBqJlul200MXBADQWQ');
    fetch(`${api_url}stripe-checkout`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userID, product_type:'gold' }),
})
  .then(response => response.json())
  .then(data => {
    const sessionId = data.sessionId;
    return stripe.redirectToCheckout({ sessionId });
  })
  .catch(error => {
    console.error('There was an issue:', error);
  });
  }
  const handleCheckout = () => {
    if (user) {
      stripeRedirect(user.uid)
    } else {
      // Show the popup if user is not logged in
      setShowPopup(true);
    }
  };

   useEffect(() => {
    if (user) {
      setShowPopup(false);
    }
  }, [user]);
  // gold tier
  return (
    <>
      {showPopup && <CreateAccountPopup auth={auth} user={user} setUser={setUser} provider={provider} startInRegister={true}/>}
    <div className={mobile ? "premium-tier-mobile":"premium-tier"}>
      <img src="/image_assets/goldtier.png"  alt="Gold Tier Icon" />
      <h2>Gold Tier</h2>
      <h2>The Worldbuilder</h2>
      <hr style={{backgroundColor:'#ffd700', border:'none', height:'1px', width:'90%'}}></hr>
      <ul>
        <li>Perfect for serious builders</li>
        <li>All the features of Silver</li>
        <li>The most powerful models (e.g., GPT4o-mini)</li>
        <li>Unlimited Character Image generation</li>
        <li>Priority access to new features</li>
        <li>Supports continued development</li>
        <li>1 Week Free Trial available</li>
        <br></br>
      </ul>
      <div className="subscription-footer">
      <p><strong>Price: $9.99/month</strong></p>
      <button onClick={handleCheckout}>{working ? 'Working... Hold on': 'Subscribe and Support'}</button>
      <p className="subscribe-text" style={{fontSize:'10px',marginTop:'6px',marginBottom:'4px'}}>You'll be taken to Stripe for secure checkout</p>
        <br></br>
        {false &&<p className="subscribe-text" style={{fontSize:'10px',marginTop:'6px',marginBottom:'4px'}}>*There's a rate limit to prevent spam clicking and bots. It's the same as in the free games.</p>}
    </div>
      </div>
      </>
  );
};

const SilverTier = ({auth, user, setUser, provider, mobile}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [working, setWorking] = useState(false);
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  const stripeRedirect = async (userID) => {
    setWorking(true);
    const stripe = await loadStripe('pk_live_51MuNJaKzLimNb9ks9sObFlOonJitH66vXp466sXmUepKGXmMyKYruzroxtnqsCAKE2WNUH8BtK9JJI90BBqJlul200MXBADQWQ');
    fetch(`${api_url}stripe-checkout`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userID, product_type:'silver' }),
})
  .then(response => response.json())
  .then(data => {
    const sessionId = data.sessionId;
    return stripe.redirectToCheckout({ sessionId });
  })
  .catch(error => {
    console.error('There was an issue:', error);
  });
  }
  const handleCheckout = () => {
    if (user) {
      stripeRedirect(user.uid)
    } else {
      // Show the popup if user is not logged in
      setShowPopup(true);
    }
  };

   useEffect(() => {
    if (user) {
      setShowPopup(false);
    }
  }, [user]);

  // This is silver tier
  return (
    <>
      {showPopup && <CreateAccountPopup auth={auth} user={user} setUser={setUser} provider={provider} startInRegister={true}/>}
    <div className={mobile ? "silver-tier-mobile":"silver-tier"}>
      <img src="/image_assets/silvertier.png"  alt="Silver Tier Icon" />
      <h2>Silver Tier</h2>
      <h2>The Storyteller</h2>
      <hr style={{backgroundColor:'rgb(216, 216, 216)', border:'none', height:'1px', width:'90%'}}></hr>
      <ul>
        <li>Perfect for creating stories</li>
        <li>Access to story creation</li>
        <li>Save, continue, share your games</li>
        <li>Play with most AI models
          <ul>
            <li style={{fontSize:"0.9em"}}>(e.g., not the most powerful models like GPT4o-mini)</li>
          </ul>
        </li>
        {/* subpoint goes here */}
        <li>Limited Image Generation</li>
        <li>No Ads</li>
        
        <br></br>
      </ul>
      <div className="subscription-footer">
      <p><strong>Price: $3.99/month</strong></p>
      <button onClick={handleCheckout}>{working ? 'Working... Hold on': 'Subscribe and Support'}</button>
      <p className="subscribe-text" style={{fontSize:'10px',marginTop:'6px',marginBottom:'4px'}}>You'll be taken to Stripe for secure checkout</p>
        <br></br>
        {false &&<p className="subscribe-text" style={{fontSize:'10px',marginTop:'6px',marginBottom:'4px'}}>*There's a rate limit to prevent spam clicking and bots. It's the same as in the free games.</p>}
    </div>
      </div>
      </>
  );
};

const SubscriptionColumns = ({auth, user, setUser, provider,mobile}) => {
  return (
    <>
    {mobile ?
    <>
      <GoldTier auth={auth} user={user} setUser={setUser} provider={provider} mobile={mobile}/>
      <SilverTier auth={auth} user={user} setUser={setUser} provider={provider} mobile={mobile}/>
      <FreeTier mobile={mobile} />

    </>
    :
    <div className="subscription-page"style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
      <FreeTier />
       <SilverTier auth={auth} user={user} setUser={setUser} provider={provider}/>
      <GoldTier auth={auth} user={user} setUser={setUser} provider={provider}/>
    </div>
}</>
  );
};

export default SubscriptionColumns;

