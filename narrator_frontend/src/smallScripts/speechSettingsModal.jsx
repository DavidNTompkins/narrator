import React from 'react';
import {AiFillSetting} from 'react-icons/ai';
import './speechSettingsModal.css';
import ReactDOM from 'react-dom';
import ModelSelector from '../CreatePageTools/ModelSelector.jsx';
import OptionSelector from '../CreatePageTools/OptionSelector.jsx';
import TrackerFields from '../CreatePageTools/TrackerFields.jsx';
import ReminderBox from '../CreatePageTools/ReminderBox.jsx';
import ExtraAdvancedFeatures from '../CreatePageTools/ExtraAdvancedFeatures.jsx';
import AutoscrollToggle from './AutoscrollToggle.jsx';
import { useSubscription } from '../subpages/AccountPageItems/SubscriptionContext.jsx';
import HallucinatorFields from '../hallucinator/HallucinatorFields.jsx';



function SpeechSettingsButton({setRules,setModelSelection,modelOptions, customRules,setCustomRules,formData,setFormData}) {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const { hasSubscription, subscriptionType } = useSubscription();

  const handleOpen = () => {
    setModalOpen(!isModalOpen);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {true && <>
      <button className="share-button" onClick={handleOpen}><AiFillSetting size={35} /></button>
        <p type="optionstext">SETTINGS</p>
      <SettingsModal isOpen={isModalOpen} onClose={handleClose} customRules={customRules} setCustomRules={setCustomRules} formData={formData} setModelSelection={setModelSelection} modelOptions={modelOptions} setRules={setRules} setFormData={setFormData} />
    </> }
    </div>
  );
}


function SettingsModal({ isOpen, onClose, customRules, setCustomRules, formData,setModelSelection, modelOptions, setRules, setFormData }) {
  
  const voices = useVoices();

  const [selectedVoice, setSelectedVoice] = React.useState(localStorage.getItem('voice') || 'Google UK English Male');
  const [rate, setRate] = React.useState(localStorage.getItem('rate') || 1.0);
  const [pitch, setPitch] = React.useState(localStorage.getItem('pitch') || 1.0);

  const handleSave = () => {
    localStorage.setItem('voice', selectedVoice);
    localStorage.setItem('rate', rate);
    localStorage.setItem('pitch', pitch);
    onClose();
  };
  //baker stats
  const [bakerStatus, setBakerStatus] = React.useState(localStorage.getItem('baker') ? (localStorage.getItem('baker') === 'true') : true);
  React.useEffect(() => {
    localStorage.setItem('baker', bakerStatus);
  }, [bakerStatus]);
  const handleBakerClick = () => {
    setBakerStatus(!bakerStatus);
  }
  
  // easy handler for generic handling of formData change
      const handleInputChange = (key, value) => {
        setFormData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

  const handleTest = () => {
    const utterance = new SpeechSynthesisUtterance("This is a test. Welcome to narrator.");
    utterance.voice = voices.find(voice => voice.name === selectedVoice);
    utterance.rate = rate;
    utterance.pitch = pitch;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={handleSave}>
      
      <h3 className='settings-title'>Set Advanced Settings</h3>
      
      {formData && <><OptionSelector setRules={setRules} rules={formData.rules} customRules={customRules} setCustomRules={setCustomRules} inSettings={true} />  
          <br></br>
        <ModelSelector modelSelection={formData.model ? formData.model : 'Open 3.5'} setModelSelection={setModelSelection} options={modelOptions} />
          <hr></hr>
        <HallucinatorFields formData={formData} setFormData={setFormData} />
        <hr></hr>
        <TrackerFields formData={formData} setFormData={setFormData} showValues={false} />
        <br></br>
        <ReminderBox formData={formData} 
                handleInputChange={handleInputChange} />
        
         <><hr></hr>        
            </>
        <ExtraAdvancedFeatures formData={formData} setFormData={setFormData} modelOptions={modelOptions} />

      <hr></hr>
      </>
      
      }
      
      <p>Note: Mobile voice may be locked.</p>
      <label className="modalWindowLabel">
        Voice:
        <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}>
          {false && <option value='neets'>neets.ai</option>}
          {voices.map(voice => (
            <option key={voice.name} value={voice.name}>{voice.name}</option>
          ))}
        </select>
      </label>
      <br></br>
      {selectedVoice=='neets' ? 
        <></>
        :
        
        <>
      <label className="modalWindowLabel">
        Rate:
        <input type="number" value={rate} min="0.5" max="2" step="0.1" onChange={e => setRate(e.target.value)} />
      </label>
      
      <label className="modalWindowLabel">
        Pitch:
        <input type="number" value={pitch} min="0" max="2" step="0.1" onChange={e => setPitch(e.target.value)} />
      </label>
      <br></br>
      <br></br>
      <button onClick={handleTest}>Test</button>
          </>}
      <button type="cancel" onClick={()=>{
      setPitch(1.0); setRate(1.0);setSelectedVoice('Google UK English Male')}}>Reset</button>
      <br></br>
      <hr></hr>
      <AutoscrollToggle />
      <br></br>
      <hr></hr>
        <button className ="rule-option-button" onClick={handleBakerClick}>Turn Adaptive Baker {bakerStatus ? 'off' : 'on'}</button>
        {!bakerStatus && <p>WARNING - Baker Recommended. See FAQ</p>}
      <hr></hr>
        <br></br>
    </Modal>
  );
}

export default SpeechSettingsButton;

function Modal({ isOpen, onClose, children, onSave }) {
    const modalRoot = document.getElementById('modal-root');

  if (!isOpen) {
    return null;
  }
  

  return ReactDOM.createPortal(
    
      <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      zIndex: 9999,
    }}>
      <div className="share-content" style={{
        backgroundColor: 'black',
        maxHeight:'80vh',
        padding: '20px',
        maxWidth:'650px',
        borderRadius: '8px',
        border: '2px solid #b4ecee',
        color: '#000',
        boxShadow: '0 4px 8px 0 #007a7a, 0 6px 20px 0 #007a7a',
          zIndex: '999',
      }}>
        {children}
        <br></br>
        <button onClick={onSave}>Save</button>
        {false &&<button type="cancel" onClick={onClose}>Close</button>}
      </div>
        </div>,
    
    modalRoot
  );
}


function useVoices() {
  const [voices, setVoices] = React.useState([]);

  React.useEffect(() => {
    const speechSynthesis = window.speechSynthesis;

    const populateVoices = () => {
      setVoices(speechSynthesis.getVoices());
    };

    populateVoices();

    // When voices have been loaded, populateVoices again
    speechSynthesis.addEventListener('voiceschanged', populateVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', populateVoices);
    };
  }, []);

  return voices;
}
