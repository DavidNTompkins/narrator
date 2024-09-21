import React from 'react';
import { AiOutlineFontSize } from 'react-icons/ai';

function FontSizeToggle({ fontSize, setFontSize }) {
  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 2);
  };

  return (
    <div className="font-size-toggle">
      <button className="font-button" onClick={decreaseFontSize}>
        <AiOutlineFontSize style={{ transform: 'scale(0.7)' }} />
      </button>
      <button className="font-button" onClick={increaseFontSize}>
        <AiOutlineFontSize />
      </button>
    </div>
  );
}

export default FontSizeToggle;
