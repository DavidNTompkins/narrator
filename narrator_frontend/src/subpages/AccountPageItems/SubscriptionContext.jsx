import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

export const SubscriptionProvider = ({ children, user }) => {
  const [hasSubscription, setHasSubscription] = useState(true);
  const [subscriptionType, setSubscriptionType] = useState('gold');
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);

  useEffect(() => {
    // Simulate a short delay to mimic data loading
    const timer = setTimeout(() => {
      setSubscriptionLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const value = {
    hasSubscription,
    subscriptionType,
    subscriptionLoaded
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};