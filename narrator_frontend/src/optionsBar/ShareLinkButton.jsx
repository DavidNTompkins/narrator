import React, { useState, useEffect } from 'react';
import { BsFillShareFill } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import publishAdventure from '/src/smallScripts/publishHandlers.js'
import './publishDialogue.css';
import {RotatingLines} from 'react-loader-spinner';
import {setTrue,isShared} from '../smallScripts/firebaseHelpers'
import Modal from '../subpages/modals/Modal.jsx'

function ShareLinkButton({formData,user,adventureID,setAdventureID,auth,provider,imageData,setIsPublished,additionalCharacters}) {
  const [showModal, setShowModal] = useState(false);
  // don't forget to add flag for is published
  const [adventureName, setAdventureName] = useState(``);
  const [authorName, setAuthorName] = useState('')
  const [isPublishing, setIsPublishing] = useState(false);
  const [tags, setTags] = useState('')
  const [isNsfw, setIsNsfw] = useState(false); 
  const [genre, setGenre] = useState("");
  const [onStepTwo, setOnStepTwo] = useState(false)
  const [shareLink, setShareLink] = useState('');
  

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

    const handleCloseShare = (copyLink) => {
    navigator.clipboard.writeText(copyLink);
    setShowModal(false);
  }
  
  const handleSave = async () => {
    if(adventureName){
    var oldSaveFlag = false;
    let newID;
    //setShowModal(false);
    setIsPublishing(true);
    if(adventureID != null) {oldSaveFlag=true;}
    if (adventureID == null) {
      newID = await uuidv4()
      await setAdventureID(newID);
      console.log(newID)
      await publishAdventure(user,adventureName, 'sharedGame', formData,newID,imageData,'sharedGame', additionalCharacters,'sharedGame','sharedGame',true)
    } else {
      await publishAdventure(user,adventureName, 'sharedGame', formData,adventureID,imageData,'sharedGame',additionalCharacters,'sharedGame','sharedGame',true)
    }
    if(oldSaveFlag){setTrue('adventures',adventureID,'shared');}
    //setIsPublished(true);
    setIsPublishing(false);
    setShareLink(`https://playnarrator.com/adventure/${adventureID}/shared/autostart`);
    setOnStepTwo(true);
    }
  };

  return (
    <>
      {!(user==null) && (!isPublishing) && (
        <div
          className="shareButton"
          style={{color: true ? null : 'gray' }}
          onClick={async () => {
            console.log(adventureID);
            if(adventureID && await isShared(adventureID)){
              setShareLink(`https://playnarrator.com/adventure/${adventureID}/shared/autostart`);
            }
            setShowModal(true)
            }
          }
          
        >
          <BsFillShareFill size={30} />
          <p type="optionstext">SHARE</p>
        </div>
      )}

      {isPublishing && (
        <div className="OptionsButton">
          <RotatingLines
  strokeColor="#007a7a"
  strokeWidth="3"
  animationDuration="0.75"
  width="35"
  visible={true}
/>
          <p type="optionstext">SHARING</p>
        </div>
      )}

            <Modal isOpen={showModal} closeModal={() => setShowModal(false)}>
              
        <div className="modal-overlay">
          {!onStepTwo ? 
          <div style={{
        backgroundColor: 'black',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #b4ecee',
        color: '#000',
        boxShadow: '0 4px 8px 0 #007a7a, 0 6px 20px 0 #007a7a',
          zIndex: '999',
      }}>
            <h2>Share your adventure</h2>
            <p>Give this a name to create a shareable link for this adventure.</p>
            
            {shareLink && <><p>Here's an existing link - if you've updated the game, reshare it.</p>
              <p className="share-link">{`https://playnarrator.com/adventure/${adventureID}/shared/autostart`}</p> </>}
            <label htmlFor="adventureName"><strong>Adventure Name</strong></label>
            <input
              type="text"
              id="adventureName"
              value={adventureName}
              placeholder="adventure name go here :)"
              onChange={(e) => setAdventureName(e.target.value)}
            />
            <br></br>
            {!isPublishing ? 
            <div className="ButtonDiv">
            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleSave} style={{backgroundColor:adventureName ? null : 'grey'}}>Confirm</button>
              </div>
              :
            <div className="ButtonDiv">
              <RotatingLines
  strokeColor="#007a7a"
  strokeWidth="3"
  animationDuration="0.75"
  width="35"
  visible={true}
/>
            </div>}
          </div>
            :
            <div style={{
          backgroundColor: 'black',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #b4ecee',
          color: '#000',
          boxShadow: '0 4px 8px 0 #007a7a, 0 6px 20px 0 #007a7a',
            zIndex: '999',
          }}>
            <p className="share-link">{`https://playnarrator.com/adventure/${adventureID}/shared/autostart`}</p>
            <br></br>
            <p>This link will start a copy of this adventure on load.</p>
              <div style={{textAlign:'center'}}>
            <button className="confirm-button"  onClick={() =>handleCloseShare(`https://playnarrator.com/adventure/${adventureID}/shared/autostart`)}>Copy and Close</button>
              </div></div>
          }
        </div>
      </Modal>
    </>
  );
}

export default ShareLinkButton;
