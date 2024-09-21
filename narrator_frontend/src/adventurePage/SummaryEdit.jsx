import React, { useState } from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';
import './SummaryEdit.css';

const SummaryEdit = ({ alternativeSummary, setAlternativeSummary, setAltered }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  const onTextChange = (event) => {
    setAlternativeSummary(event.target.value);
    setAltered(true);
  };

  const toggleDisabled = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <div className="tooltip-container">
      <br></br>
      <button className='lock-button' type='button' onClick={(e) =>{
      e.preventDefault();
      e.stopPropagation();
      toggleDisabled();
    }} style={{ marginTop: "10px", color: isDisabled ? 'red' : '#b4ecee' }} >
        {isDisabled ? <FaLock /> : <FaUnlock />}
      </button>
      <span className="tooltip-text" style={{color:'#b4ecee',fontSize:'1.3em'}}>Your current game summary</span>
      <br></br>
      <textarea
        value={alternativeSummary}
        onChange={onTextChange}
        disabled={isDisabled}
        style={{ width: "80%", height: "100px",maxWidth:'600px', background:'#333333',color:'#c0c0c0' }}
      />
      
    </div>
  );
};

export default SummaryEdit;
