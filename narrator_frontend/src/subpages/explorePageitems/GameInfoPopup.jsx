import React, { useState,useRef, useEffect } from 'react';
import './GameInfoPopup.css'; // Importing a stylesheet for styling
import {BsFillQuestionCircleFill} from 'react-icons/bs';

const GameInfoPopup = ({ gameInfo }) => {
   const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    const togglePopup = () => {
      setShowPopup(!showPopup);
    };

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="game-container" ref={popupRef}>
        <div className="icon-container" onClick={togglePopup}>
          {/* Your Icon Here */}
          <BsFillQuestionCircleFill className={showPopup ? 'active-button':''}/>
        </div>
        {showPopup && (
          <div className="game-info-popup">
            <h3>{gameInfo.name}</h3>
            <p>{gameInfo.description}</p>
            {/* Add more game details here */}
          </div>
        )}
      </div>
    );
  };
export default GameInfoPopup;
