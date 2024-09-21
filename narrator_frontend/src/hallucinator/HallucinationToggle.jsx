// DarkModeToggle.jsx
import React, { useState } from 'react';
import { AiFillPicture } from "react-icons/ai";
import { useHallucination } from './HallucinationContext';
//import './your-stylesheet.css'; // Make sure to import your CSS file

function HallucinationToggle({downgraded}) {
  const { images, hallucinationOn, setHallucinationOn } = useHallucination();
  const [showTooltip, setShowTooltip] = useState(false);
  const [shake, setShake] = useState(false);

  const toggleHallucinate = () => {
    if(downgraded){
      setShowTooltip(true);
      setShake(true);
      setTimeout(() => {
        setShowTooltip(false);
        setShake(false);
      }, 2000); // Hide tooltip and stop shaking after 2 seconds
    } else {
      setHallucinationOn((prevMode) => !prevMode);
    }
  };

  return (
    <div className="hallucination-toggle">
      <button
        className={`dark-button ${shake ? 'shake-animation' : ''}`}
        onClick={toggleHallucinate}
      >
        <AiFillPicture color={hallucinationOn ? 'gold' : 'gray'} />
      </button>
      {showTooltip && (
        <div className="hallucination-toggle-tooltip">
          Image stream is only available to Gold Tier subscribers
        </div>
      )}
    </div>
  );
}

export default HallucinationToggle;
