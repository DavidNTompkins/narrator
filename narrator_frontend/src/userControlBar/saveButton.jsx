import React, { useState, useEffect } from 'react';
import { FaRegSave, FaCheck } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import saveOrUpdateAdventure from '../adventure'
import hyperion from '../hyperion'
import './saveDialogue.css';
import {RotatingLines} from 'react-loader-spinner';

function SaveButton({formData,save,setSave,user,setUser,messages,adventureID,setAdventureID,hyperionSummary,setHyperionSummary,setHyperionFlag,auth,provider,imageData,setImageData,additionalCharacters,isPublished,textlog,setTextlog,hyperionNeeded,setHyperionNeeded,editableTextlog,bakedCharacters}) {
  const [showModal, setShowModal] = useState(false);
  const [adventureName, setAdventureName] = useState(``);
  const [savedRecently, setSavedRecently] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autosaved, acknowledgeAutosaved] = useState(false);

  useEffect(() => {
    if (savedRecently) {
      setSavedRecently(false);
    }
  }, [messages,additionalCharacters,formData]);

    // for autosave effect
  useEffect(() => {
    if(save && hyperionSummary instanceof Promise){
      hyperionSummary
      .then((result) => {
        if (typeof result === 'string') {
      console.log(hyperionSummary);
  acknowledgeAutosaved(true);
    const timer = setTimeout(() => {
      acknowledgeAutosaved(false);
    }, 3000);  // Change back to initial icon after 2 seconds

    return () => clearTimeout(timer);  // This is to clear timeout if the component unmounts
  }
      })
      .catch((error) => {
        console.error(error);
        // handle error
      });
  }

}, [hyperionSummary]);

  
  const handleSave = async () => {
    let newID;
    setShowModal(false);
    setSave(true);
    setIsSaving(true);
    if (adventureID == null) {
      newID = await uuidv4()
      await setAdventureID(newID);
    } else {
      newID = adventureID; // lazy fix for handling saving published advnetures
           }
    if (messages.length >= 4) {
      setSavedRecently(true);
      setHyperionFlag(true);
      const newhype = await hyperion(messages, setHyperionFlag, user, true, formData, newID,imageData,setImageData,additionalCharacters,textlog,hyperionNeeded.current, setHyperionNeeded,hyperionSummary,editableTextlog,bakedCharacters,isPublished,adventureName,true);
      setHyperionSummary(newhype);
      setSavedRecently(true);
    }
    setIsSaving(false);
  };

  return (
    <>
      {(messages.length >= 4) && !savedRecently && !(user==null) && (
        <div
          className={`OptionsButton ${autosaved ? "flash" : ""}`}
          style={{ marginRight: '5px', color: save ? null : 'gray' }}
          onClick={async () => {
            if(!save){
            setShowModal(true)
            } else{
              setIsSaving(true);
              setSavedRecently(true);
              setHyperionFlag(true);
              const newhype = await hyperion(messages, setHyperionFlag, user, save, formData, adventureID,imageData,setImageData,additionalCharacters,textlog,hyperionNeeded.current, setHyperionNeeded,hyperionSummary,editableTextlog,bakedCharacters,isPublished,adventureName,true);
              setHyperionSummary(newhype);
              setIsSaving(false);
            }
          }
          }
        >
      {autosaved ? <FaCheck size={40} /> : <FaRegSave size={40} />}
        </div>
      )}

      {isSaving && (
        <div className="OptionsButton">
          <RotatingLines
  strokeColor="#007a7a"
  strokeWidth="3"
  animationDuration="0.75"
  width="35"
  visible={true}
/>
          <span>Saving...</span>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div style={{
        backgroundColor: 'black',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #b4ecee',
        color: '#000',
        boxShadow: '0 4px 8px 0 #007a7a, 0 6px 20px 0 #007a7a',
          zIndex: '999',
      }}>
            <h2>Create new save file</h2>
            <p>Name your adventure. Click the icon again to download an updated save file.</p>
            <label htmlFor="adventureName">Adventure Name</label>
            <input
              type="text"
              id="adventureName"
              value={adventureName}
              onChange={(e) => setAdventureName(e.target.value)}
            />
            <br></br>
            <div className="ButtonDiv">
            <button className="confirm-button" onClick={handleSave}>Confirm</button>
            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
            </div>
        </div>
      )}
    </>
  );
}

export default SaveButton;
