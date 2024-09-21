import React, { useState, useEffect } from 'react';
import {rulesets} from '../presets/rules.js'
import './OptionSelector.css'

export default function OptionSelector({setRules, rules, customRules,setCustomRules,inSettings=false}) {
  const [selectedOption, setSelectedOption] = useState('Custom');
  //const [customRules, setCustomRules] = useState('');
  const [rulesVisible,setRulesVisible] = useState(false);

  useEffect(()=> {
    if(!inSettings){
    setRules(rulesets.Standard);
    setCustomRules(rulesets.Standard);
    }
  },[])
  
  const handleOptionChange = (option, defaultRules) => {
    setSelectedOption(option);
    if(option=== 'Custom') setRulesVisible(true);
    if (option === 'Custom' && customRules) {
      setRules(customRules);
    } else {
      setRules(defaultRules);
    }
  };

  const handleRulesChange = (event) => {
    setRules(event.target.value);
    
    if (selectedOption === 'Custom') {
      setCustomRules(event.target.value);
    } else {
      setCustomRules(event.target.value);
      setSelectedOption('Custom');
    }
  };

  return (
    <div className='option-selector-div'>
      <p>Rule Set:</p> 
      <button className="rule-option-button" type="button" onClick={() => handleOptionChange('Standard', rulesets.Standard)} 
              style={{backgroundColor: selectedOption === 'Standard' ? null : 'gray'}}>
        Recommended
      </button>
      <button className="rule-option-button" type="button" onClick={() => handleOptionChange('Verbose', rulesets.Verbose)} 
              style={{backgroundColor: selectedOption === 'Verbose' ? null : 'gray'}}>
        Verbose
      </button>
      <button className="rule-option-button" type="button" onClick={() => handleOptionChange('Custom', customRules)} 
              style={{backgroundColor: selectedOption === 'Custom' ? null : 'gray'}}>
        Custom
      </button>
      <br></br>
      {rulesVisible &&
      <textarea rows='8' className="rules-editor" value={rules} onChange={handleRulesChange}></textarea>}
    </div>
  );
}
