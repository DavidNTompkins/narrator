import React, { useState } from 'react';
import presets from './presets/basePresets.json'

function ClickableButton({ label, onClick}) {
  const [isClicked, setIsClicked] = useState(false);
  
  const keys = Object.keys(presets[label])
  const randIndex = Math.floor(Math.random() * keys.length)
  const randKey = keys[randIndex]
  const formData = presets[label][randKey]

  
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
    onClick(formData); // Call the function passed in as onClick prop
  };

  return (
    <button
      className={`clickable-button ${isClicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
export default ClickableButton