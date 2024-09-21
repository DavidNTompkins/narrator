//import { FaShareSquare } from 'react-icons/fa';
import {FaEdit} from 'react-icons/fa'
import React, { useState, useEffect } from 'react';
import {nanoid}  from "nanoid";
import ReactDOM from 'react-dom';


const Modal = ({ children, handleClose }) => {
  const modalRoot = document.getElementById('modal-root');

  // Clicking outside the modal content can also close the modal
  const handleOutsideClick = (event) => {
    if (event.target.id === "modal-root") {
      handleClose();
    }
  }

  return ReactDOM.createPortal(
    <div className="share-screen" onClick={handleOutsideClick} id="modal-root">
      {children}
    </div>,
    modalRoot
  );
};

function ShareButton({formData,id,setID}) {
  const [showShare, setShowShare] = useState(false);
  const [shareLink, setShareLink] = useState("")
  
  const handleButtonClick = async() => {
    if((id == null)){
      const tempID = nanoid();
    setShowShare(!showShare);
    const response = await fetch('https://Narratornoncriticalbackend.davidtompkins3.repl.co/setStory', {
          method: 'POST',
          headers: {
    'Content-Type': 'application/json'
  },
          body: JSON.stringify({tempID,formData})
    })
      const result = await response.json()
      setID(result.id)
    console.log(result.id)
      setShareLink("https://playnarrator.com/create/?storyid="+result.id)
    }else {
      setShowShare(!showShare);
    }
  }

  const handleCloseShare = () => {
    navigator.clipboard.writeText(shareLink);
    setShowShare(false);
  }

  return (
    <>
      <button className="share-button" onClick={handleButtonClick}>
        <FaEdit size={40} />
      </button>
      {showShare && (
        <Modal handleClose={handleCloseShare}>
          <div className="share-content">
            <p className="share-link">{shareLink}</p>
            <br></br>
            <p>This link will let you edit the starting prompt</p>
            <button className="closeButton" onClick={handleCloseShare}>Copy and Close</button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ShareButton;