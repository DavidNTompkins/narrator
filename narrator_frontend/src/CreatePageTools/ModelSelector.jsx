import React, { useState, useEffect } from 'react';
import './ModelSelector.css';
import { SiOpenai } from 'react-icons/si';
import { BsMeta, BsFire } from 'react-icons/bs';
import { GiWingfoot, GiDolphin } from 'react-icons/gi';
import { TbHexagonLetterM } from 'react-icons/tb';
import { PiNumberSquareEightFill, PiInfinityBold } from "react-icons/pi";

const ModelSelector = ({ modelSelection, setModelSelection, options }) => {
  const [customModel, setCustomModel] = useState('');

  useEffect(() => {
    if (modelSelection === 'Other') {
      setCustomModel('');
    } else if (!options.includes(modelSelection)) {
      setCustomModel(modelSelection);
    }
  }, [modelSelection, options]);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setModelSelection(selectedValue);
    if (selectedValue !== 'Other') {
      setCustomModel('');
    }
  };

  const handleCustomModelChange = (event) => {
    const value = event.target.value;
    setCustomModel(value);
    setModelSelection(value || 'Other');
  };

  const getIcon = (model) => {
    switch(model) {
      case "GPT 4o-Mini": return <SiOpenai className="model-icon" />;
      case "Open Orca": return <GiDolphin size="1.15em" className="model-icon" />;
      case "Hermes": return <GiWingfoot className="model-icon" />;
      case "Mistral": return <GiDolphin size="1.15em" className="model-icon" />;
      case "Zephyr": return "🤗";
      case "Toppy": return  <BsFire className="model-icon"/>;
      case "Hermes 13b": return (<><GiWingfoot className="model-icon" /></>);
      case "Open 3.5": return (<><PiInfinityBold className="model-icon" /><p>(BETA)</p></>);
      case "Mixtral": return <><PiNumberSquareEightFill/><p>(BETA)</p></>;
      default: return null;
    }
  };

  const getDescription = (model) => {
    switch(model) {
      case "GPT 4o-Mini": return "The smartest, fastest model that sometimes rejects immoral behavior";
      case "Open Orca": return "A newer model - Previously listed here as 'Mistral'";
      case "Mistral": return "A newer model - Previously listed here as 'Mistral'";
      case "Hermes": return "A small, decently smart model.";
      case "Zephyr": return "A fairly fast and pretty good model!";
      case "Toppy": return "A pretty good model by The Bloke - the best at NSFW.";
      case "Hermes 13b": return "A larger, more powerful model by the folks behind our other Hermes model.";
      case "Open 3.5": return "A model by the folks at OpenChat - fairly smart!";
      case "Mixtral": return "A 'Mixture of Experts' model by Mistral - Pretty smart, but sometimes talks itself into a loop.";
      case "MythoMist 7b" : return "A small but powerful model built by merging several top models. Built with Roleplay in mind!";
      case "MythoMax 13b" : return "A larger model built by the folks behind the MythoMist model. Built with Roleplay in mind!";
      case "Dolphin Mixtral" : return "A Mixtral finetune that's gotten pretty positive reviews.";
      case "Hermes Mixtral" : return "A Mixtral finetune that's gotten pretty positive reviews.";
      case "Other": return `Custom model selected: ${customModel || 'None'}`;
      default: return "Custom model";
    }
  };

  return (
    <>
      <div className='option-selector-div'>
        <p>Model: </p>
        <div className="model-selector">
          {getIcon(modelSelection)}
          <select 
            value={options.includes(modelSelection) ? modelSelection : 'Other'} 
            onChange={handleSelectionChange} 
            className="model-dropdown"
          >
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
        {(!options.includes(modelSelection) || modelSelection === 'Other') && (
          <input
            type="text"
            value={customModel}
            onChange={handleCustomModelChange}
            placeholder="Enter custom model name from OpenRouter (e.g., microsoft/wizardlm-2-8x22b) "
            className="custom-model-input"
          />
        )}
        <p className="model-description" style={{fontSize:'0.9em'}}>
          {getDescription(modelSelection)}
        </p>
      </div>
    </>
  );
};

export default ModelSelector;