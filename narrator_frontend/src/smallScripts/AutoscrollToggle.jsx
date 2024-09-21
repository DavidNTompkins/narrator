import React, { useState, useEffect } from 'react';

const AutoscrollToggle = () => {
  
  // Using state to store the value of 'disableAutoscroll'
  const [currentVal, setCurrentVal] = useState(localStorage.getItem('disableAutoscroll'));

  useEffect(() => {
    // Whenever the component mounts, we'll set the current value from local storage.
    setCurrentVal(localStorage.getItem('disableAutoscroll'));
  }, []); // This empty dependency array means the useEffect will only run once when the component mounts.

  const toggleAutoscroll = () => {
    const newValue = currentVal === 'true' ? 'false' : 'true';
    localStorage.setItem('disableAutoscroll', newValue);
    setCurrentVal(newValue); // Update the state, causing a re-render with the updated value.
  };

  return (
    <button onClick={toggleAutoscroll}>
      {currentVal === 'true' ? 'Enable Autoscroll' : 'Disable Autoscroll'}
    </button>
  );
};

export default AutoscrollToggle;
