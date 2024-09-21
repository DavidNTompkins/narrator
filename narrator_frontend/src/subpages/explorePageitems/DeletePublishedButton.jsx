import React from 'react';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';
import { BsFillTrash3Fill } from "react-icons/bs";

// this is just for deleting saved games, not 
const DeletePublishedButton = ({ adventureID,onDelete}) => {

  const db = getFirestore();
  //const storage = getStorage();

  const handleDeleteClick = async (event) => {
      event.stopPropagation();
    if (!adventureID) {
      console.error("Missing adventure or user information.");
      return;
    }
  
    // Check if adventureID and userId are in the format you expect
    if (typeof adventureID !== "string") {
      console.error("Invalid adventure or user information.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this adventure? This will remove the game from the Explore page, but any saved games will persist.")) {
      return;
    }
    
    const adventureDocPath = `publishedAdventures/${adventureID}`;

    // Remove the adventure from Firestore
    deleteDoc(doc(db, adventureDocPath))
      .then(() => {
        console.log("Document successfully deleted!");
        onDelete(adventureID);
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  return (
    <div className="publishedDeleteButton">
    <button onClick={handleDeleteClick}>
      <BsFillTrash3Fill style={{color:'red'}} />
    </button>
      </div>
  )
}

export default DeletePublishedButton;
