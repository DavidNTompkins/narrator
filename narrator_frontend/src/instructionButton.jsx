import { FaQuestionCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
function InstructionButton() {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleButtonClick = () => {
    setShowInstructions(!showInstructions);
  }

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  }
  

  return (
    <>
      <button className="instruction-button" onClick={handleButtonClick}>
        <FaQuestionCircle size={42} />
      </button>
      {showInstructions && (
        <div className="instruction-screen">
          <div className="instruction-content">
          <h2>How to play</h2>
          <p>This is a spoken-word adventure game.</p>
            <p>Fill the fields (or use the red buttons to pick a pre-built story hook) and then hit start.</p>
            <p> When the game starts, you will see a few pictures, and then hear the narrator speak. When the narrator is done speaking, HOLD spacebar to record your response. If you're on mobile, press and hold an image to record.</p>
            <p>This game sounds and works best on chrome, and best of all on chrome desktop (i.e., not mobile).</p>
            <p> Speak to the game like you would speak to a person. </p>
            <a href="/faq"><p>See FAQ for more information</p></a>
            <button className="closeButton" onClick={handleCloseInstructions}>Close</button>
            </div>
        </div>
      )}
    </>
  );
}

export default InstructionButton;