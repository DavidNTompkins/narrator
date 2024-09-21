import React from 'react';
import { useSubscription } from './SubscriptionContext.jsx';


function SubscriptionStatus({ userProfile }) {
  const { hasSubscription, subscriptionType } = useSubscription();

  let displayMessage;
  let activeSubscription = userProfile.subscriptionStatus ? 
    userProfile.subscriptionStatus=="active" || userProfile.subscriptionStatus=="trialing" ?
    true : false : false;

  let freeUntil = userProfile.freeUntil ? 
    userProfile.freeUntil : false;

  console.log(userProfile);
    
  if(activeSubscription){
    displayMessage= `You are a ${subscriptionType} supporter! Thank you!`
  } else if (freeUntil && hasSubscription){
  const freeUntilDate = freeUntil.toDate();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(freeUntilDate);
  displayMessage = `You are on a free plan until ${formattedDate}. Thank you!`;

  } else {
    displayMessage= "No subscription found (refresh the page if this changed recently)."
  }
  
  return (
    <div>
      <h2>Subscription Status</h2>
      <p style={{color:hasSubscription && 'gold', fontWeight:hasSubscription && 'bold'}}>{displayMessage}</p>
      {!activeSubscription && <a style={{color:"#b4ecee"}} href="/plans">We're no longer taking subscriptions - closing soon!</a>}
      {activeSubscription && <a style={{color:"#b4ecee"}} href="https://billing.stripe.com/p/login/dR6g2J3TtcsSdtCaEE">Want to manage or cancel your subscription? Click here (we cancelled all future charges already).</a>}
    </div>
  );
}

export default SubscriptionStatus;
