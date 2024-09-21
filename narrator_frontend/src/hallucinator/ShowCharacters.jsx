import React, { useState, useEffect, useContext } from 'react';
import { useHallucination } from './HallucinationContext'; // Adjust this path to where your context is defined
const ShowCharacters = () => {
  const { hallucinationOn, setHallucinationOn } = useHallucination(); // Assuming your context provides these

  const toggleHallucination = () => {
    setHallucinationOn(!hallucinationOn);
  };

  return (
          
              <div className="show-characters">
                <button 
                  style={{ marginTop: 0, border: '1px solid #007a7a', backgroundColor:'#004040', padding: 'auto 2em' }} 
                  onClick={toggleHallucination} 
                  className="card-button"
                >
                  Show Characters
                </button>
  
        </div>
  );
};

export default ShowCharacters;
