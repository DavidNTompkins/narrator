import React from 'react';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';
import { BsFillTrash3Fill } from "react-icons/bs";

// this is just for deleting saved games, not 
const DeleteButton = ({ adventure, userId, updateAdventuresList }) => {

  const db = getFirestore();
  const storage = getStorage();

  const handleDeleteClick = async (event) => {
      event.stopPropagation();
    if (!adventure || !adventure.adventureID || !userId) {
      console.error("Missing adventure or user information.");
      return;
    }
  
    // Check if adventureID and userId are in the format you expect
    if (typeof adventure.adventureID !== "string" || typeof userId !== "string") {
      console.error("Invalid adventure or user information.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this adventure?")) {
      return;
    }
    
    const adventureDocPath = `adventures/${adventure.adventureID}`;
    const imagesFolderPath = `users/${userId}/adventures/${adventure.adventureID}`;

    // Remove images from Firebase Storage
    const listRef = ref(storage, imagesFolderPath);
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // Remove the adventure from Firestore
    deleteDoc(doc(db, adventureDocPath))
      .then(() => {
        console.log("Document successfully deleted!");
        updateAdventuresList(adventure.adventureID);
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  return (
    <button onClick={handleDeleteClick}>
      <BsFillTrash3Fill />
    </button>
  )
}

export default DeleteButton;
