import React, { useState, useEffect, useRef } from "react";
import ImageComponent from "./ImageComponent";
import "./EditableImage.css";
import { FaPaintBrush, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { FiLoader } from "react-icons/fi";
import { BsFillTrash3Fill, BsHousesFill, BsHouses  } from "react-icons/bs";
import ConfirmationModal from './ConfirmationModal.jsx';
import ImportCharacterWindow from './ImageButtons/ImportCharacterWindow.jsx';
import ReactDOM from 'react-dom'; // add this line
import ImageUploadWrapper from '../CreatePageTools/ImageUploadWrapper.jsx'


const UserProfile = ({
  imageData,
  setImageData,
  index,
  name,
  role,
  background,
  description,
  mobile,
  handleEdit,
  handleDelete,
  user,
  handleCharacterActivation,
  inactive,
  retrievedAdventures,
  setRetrievedAdventures,
  isPrimaryCharacter=false,
  type="character"
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [popup, setPopup] = useState(false); // for image edits
  const [showModal, setShowModal] = useState(false); // for content edits
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userID = user ? user.uid : "NotLoggedIn";
  
  const [popupPosition, setPopupPosition] = useState({}); // for tracking popup position
  const parentRef = useRef(); // to reference the edit button

  
  
const openModal = () => {
  setShowDeleteModalOpen(true);
};

const closeModal = () => {
  setShowDeleteModal(false);
};

const confirmDeletion = () => {
  handleDelete(index);
  closeModal();
};
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  const apiUrl = `${api_url}singleimage`;
  const [selectedStyle, setSelectedStyle] = useState("enhance");
  const [alttext,setAlttext] = useState("No Image set. Click paintbrush to create.");
  const styles = [
    "enhance",
    "3d-model",
    "analog-film",
    "anime",
    "cinematic",
    "comic-book",
    "digital-art",
    "fantasy-art",
    "isometric",
    "line-art",
    "low-poly",
    "modeling-compound",
    "neon-punk",
    "origami",
    "photographic",
    "pixel-art",
    "tile-texture",
  ];
  // for content edits
  const [newName, setNewName] = useState(name);
  const [newRole, setNewRole] = useState(role);
  const [newBackground, setNewBackground] = useState(background);
  const [newDescription, setNewDescription] = useState(description);

  const portalElement = document.getElementById('modal-root'); // add this line

// refreshing fields when character above is deleted
  useEffect(() => {
    setNewName(name);
    setNewRole(role);
    setNewBackground(background);
    setNewDescription(description);
  },[imageData,description]);
  

  const handleEditClick = () => {
  setPopup(true);
  setIsEditing(true);
  const rect = parentRef.current.getBoundingClientRect(); // get the position of the edit button
  const offset = rect.width * 0.5; // get the position of the edit button
     if(mobile) {
    // position in the center of the screen for mobile devices
    setPopupPosition({
      top: window.innerHeight / 2,
      left: window.innerWidth / 2,
    });
  } else {
    setPopupPosition({ // update the position state
      top: Math.max(rect.top + (rect.height/2),0),
      left: Math.max(rect.left + (rect.width),0),
    });
     }
  console.log(popupPosition)
  };

  const handleContentEditClick = () => {
    if(user){
  setShowModal(true);
  const rect = parentRef.current.getBoundingClientRect(); // get the position of the edit button
  const offset = rect.width * 0.5; // get the position of the edit button
     if(mobile) {
    // position in the center of the screen for mobile devices
    setPopupPosition({
      top: (window.innerHeight / 2) ,
      left: window.innerWidth / 2,
    });
  } else {
    setPopupPosition({ // update the position state
      top: Math.max(rect.top  + (rect.height*0.5),0),
      left: Math.max(rect.left + (rect.width),0),
    });
     }
//   console.log(rect.height)
    }
  };
  
  const updateImageArray = (index, newValue) => {
    setImageData((prevImageData) => {
      const updatedImageData = [...prevImageData];
      updatedImageData[index] = newValue;
      return updatedImageData;
    });
  };
  // triggered on confirm of new image
  const handleConfirmClick = async (newDescription) => {
    setPopup(false);
    handleEdit(index,newName, newRole,newBackground,newDescription);
    setNewDescription(newDescription);
    const newBase64 = await updateImage(newDescription, apiUrl, selectedStyle);
    updateImageArray(index, newBase64);
    setIsEditing(false);
  };
  // triggered on dropping of new image
  const handleImageProcessed = (base64Image) => {
        updateImageArray(index, base64Image);
        // Handle the base64 image as needed
    };

  const handleCancelClick = () => {
    setPopup(false);
    setShowModal(false);
    //setInputValue(promptText);
    
    setIsEditing(false);
  };
  // for the importer:
  const handleCharacterImport = (newName, newRole, newBackground, newDescription,image) =>{
    handleEdit(index,newName, newRole,newBackground,newDescription);
    setNewName(newName);
    setNewRole(newRole);
    setNewBackground(newBackground);
    setNewDescription(newDescription);
    //console.log(image);
    updateImageArray(index, image);
  }
  

  const updateImage = async (newText, apiUrl, style) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newText, style, userID }),
    });

    const result = await response.text();
    //console.log(result);
    if(result=='reject'){setAlttext("Your prompt hit an error or was rejected by our image provider. Try again, removing any provacative words (these can sometimes be unexpected, like the word 'peg' - sorry pirates!).")}
    return result;
  };

  return (
    
    <div className="editable-image" ref={parentRef}>
      <ImageUploadWrapper onImageProcessed={handleImageProcessed}>
      <div
        type="image"
        style={{ width: mobile ? (transVisible ? "40vw" : "") : "" }}
      >
        <div className="image-group">
          <ImageComponent
            data={imageData[index]}
            bio={name}
            mobile={mobile}
            transVisible={transVisible}
            alttext={alttext}
            inactive={inactive}
          />
        </div>
        <h4>{name ? name : "Click book to edit"}</h4>
        {!isEditing ? (
          <button className="edit-button" type="button" onClick={handleEditClick}>
            <FaPaintBrush />
            <span className="tooltiptext">Edit Image Prompt</span>
          </button>
        ) : (
          <button className="edit-button" type="button">
            <FiLoader />
          </button>
        )}
         <button className="edit-button2" type="button" onClick={handleContentEditClick}>
            <GiSecretBook style={{color: role=="" ? 'red':null}} />
          <span className="tooltiptext">{user ? 'Edit Character Details' : 'Log in to edit'}</span>
          </button> 
        {!(isPrimaryCharacter) && <button type="button" className="delete-character-button" onClick={()=>setShowDeleteModal(true)}>
            <BsFillTrash3Fill />
          <span className="tooltiptext">Delete Character</span>
          </button>}
        
        <ImportCharacterWindow
          handleCharacterImport = {handleCharacterImport}
          retrievedAdventures = {retrievedAdventures}
          setRetrievedAdventures = {setRetrievedAdventures}
          user={user}
          type={type}
          />
        
        {!(isPrimaryCharacter) && <button type="button" className="activate-character-button" onClick={()=>handleCharacterActivation(index)}>
          {type==='character' ?
          inactive ? <><FaRegUserCircle /> <span className="tooltiptext">Activate Character</span> </>
            : <><FaUserCircle /> <span className="tooltiptext">Deactivate Character</span> </>
          : inactive ? <><BsHouses /> <span className="tooltiptext">Activate World Info</span> </>
          : <><BsHousesFill /> <span className="tooltiptext">Deactivate World Info</span> </>}
          </button>}
      </div> 

      {popup && portalElement && ReactDOM.createPortal(
        <div className="edit-popup" style={{position: mobile ? 'fixed' : 'absolute', ...popupPosition}}>
          <label style={{ color: "black" }}>Edit Image Prompt</label>
          <textarea
            value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
          />
          <label style={{ color: "black" }}>
            Style:
          </label>
          <select
            className="style-select"
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
          >
            {styles.map((style, index) => (
              <option key={index} value={style}>
                {style}
              </option>
            ))}
          </select>
          <button type="button" onClick={()=>handleConfirmClick(newDescription)}>Confirm</button>
          <button type="button" onClick={handleCancelClick}>Cancel</button>
        </div>,
      portalElement
      )}
      {showModal && portalElement && 
        ReactDOM.createPortal(
      type==="character" ? 
        <div className="edit-popup" style={{position: mobile ? 'fixed' : 'absolute', ...popupPosition}}>
          <label style={{ color: "black" }}>Edit Character</label>
          <label>Name:</label>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Steve Irons"/>
          
          <label>What are they like?:</label>
          <textarea type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="human wizard, has a gun" style={{resize:'vertical'}}/>
          
          <label>Background or motive:</label>
          <textarea type="text" value={newBackground} onChange={(e) => setNewBackground(e.target.value)} placeholder="Wants to find who killed his dog" style={{resize:'vertical'}} />
          <button type="button" onClick={()=>{
          handleEdit(index,newName,newRole,newBackground,newDescription);
          setShowModal(false);}}>Confirm</button>
          <button type="button" onClick={handleCancelClick}>Cancel</button>
        </div>
      : 
      <div className="edit-popup" style={{position: mobile ? 'fixed' : 'absolute', ...popupPosition}}>
          <label style={{ color: "black" }}>Edit World Info</label>
          <label>Name:</label>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="The City of Iron"/>
          
          <label>What is it?:</label>
          <textarea value={newRole} style={{height:'5em',resize:'vertical'}} onChange={(e) => setNewRole(e.target.value)} placeholder="A large citadel known for its production of weapons and brutal politics."/>
          
          <button type="button" onClick={()=>{
          handleEdit(index,newName,newRole,newBackground,description);
          setShowModal(false);}}>Confirm</button>
          <button type="button" onClick={handleCancelClick}>Cancel</button>
        </div>,
          portalElement
      )}
      <ConfirmationModal 
      isOpen={showDeleteModal} 
      onConfirm={confirmDeletion} 
      onCancel={closeModal} 
    />
        </ImageUploadWrapper>
    </div>
    
  );
};

export default UserProfile;

