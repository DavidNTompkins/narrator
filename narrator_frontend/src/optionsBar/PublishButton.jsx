import React, { useState, useEffect } from 'react';
import { GiTiedScroll } from 'react-icons/gi';
import { v4 as uuidv4 } from 'uuid';
import publishAdventure from '/src/smallScripts/publishHandlers.js'
import './publishDialogue.css';
import {RotatingLines} from 'react-loader-spinner';
import {setTrue} from '../smallScripts/firebaseHelpers'
import Modal from '../subpages/modals/Modal.jsx'
import { getFirestore, doc, getDoc } from "firebase/firestore";

function PublishButton({formData,user,adventureID,setAdventureID,auth,provider,imageData,setIsPublished,additionalCharacters, editingExistingGame, existingGamePacket}) {
  const [showModal, setShowModal] = useState(false);
  // don't forget to add flag for is published
  const [adventureName, setAdventureName] = useState(``);
  const [authorName, setAuthorName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [tags, setTags] = useState('')
  const [isNsfw, setIsNsfw] = useState(false); 
  const [genre, setGenre] = useState("");
  const genres = [
                  "Adventure",
                  "Fantasy",
                  "CYOA",
                  "Fan-Fiction",
                  "AI Weirdness",
                  "Mystery",
                  "Crime",
                  "Anime",
                  "Romance",
                  "Action",
                  "Sci-Fi",
                  "Comedy",
                  "Horror",
                  "Drama",
                  "NSFW",
                  "Other"];

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  
  useEffect(() => {
    
    const fetchUserName = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      try {
        const docSnap = await getDoc(userRef);

        if (docSnap.exists() && !authorName) {
            setAuthorName(docSnap.data().name || 'Mystery Author');
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.log('error in retrieving name, ',err)
      } 
    };
    if(user){
    fetchUserName();
    }
  }, [user]);

  useEffect(()=>{
    if(editingExistingGame && showModal){
      setAdventureName(existingGamePacket.adventureName);
      setGameDescription(existingGamePacket.gameDescription);
      setTags(existingGamePacket.tags);
      setIsNsfw(existingGamePacket.isNsfw=='NSFW');
      setGenre(existingGamePacket.genre);
      setAuthorName(existingGamePacket.authorName)
      console.log(existingGamePacket)
    }
  },[formData,showModal])
  
  const handleSave = async () => {
    var oldSaveFlag = false;
    let newID;
    setShowModal(false);
    setIsPublishing(true);
    if(adventureID != null) {oldSaveFlag=true;}
    if (adventureID == null) {
      newID = await uuidv4()
      await setAdventureID(newID);
      console.log(newID)
      await publishAdventure(user,adventureName || 'Mystery Adventure', authorName || 'Mystery Author', formData,newID,imageData,tags,additionalCharacters,isNsfw ? "NSFW" : "notNSFW",genre,false, gameDescription)
    } else {
      await publishAdventure(user,adventureName || 'Mystery Adventure', authorName || 'Mystery Author', formData,adventureID,imageData,tags,additionalCharacters,isNsfw ? "NSFW" : "notNSFW",genre,false, gameDescription)
    }
    if(oldSaveFlag){setTrue('adventures',adventureID,'published');}
    setIsPublished(true);
    setIsPublishing(false);
  };

  return (
    <>
      {!(user==null) && (!isPublishing) && (
        <div
          className="publishButton"
          style={{color: true ? null : 'gray' }}
          onClick={async () => {
          
            setShowModal(true)
            }
          }
          
        >
          <GiTiedScroll size={40} />
          <p type="optionstext">{editingExistingGame ? 'UPDATE' : 'PUBLISH' }</p>
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
          <p type="optionstext">Publishing</p>
        </div>
      )}

            <Modal isOpen={showModal} closeModal={() => setShowModal(false)}>
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
            <h2>Publish your adventure</h2>
            <p>Give it a name, take credit, and release it to the public. This shares the adventure hook, not your progress.</p>
            <p>If you've uploaded images - keep it PG-13 at most! Any extreme content will get deleted and might get ya banned.</p>
            <label htmlFor="adventureName">Adventure Name</label>
            <input
              type="text"
              id="adventureName"
              value={adventureName}
              placeholder="Theo and Shim open a bakery"
              onChange={(e) => setAdventureName(e.target.value)}
            />
            <br></br>
            <label htmlFor="adventureName">Author: </label>
            <input
              type="text"
              id="authorName"
              value={authorName}
              placeholder="THIS IS PUBLIC"
              onChange={(e) => setAuthorName(e.target.value)}
            />
            <br></br>
            <label htmlFor="adventureName">Adventure Description</label>
            <textarea
              type="text"
              id="adventureName"
              value={gameDescription}
              className="adventure-description"
              placeholder="This information will be visible on the homepage but not used in gameplay. Give your story an exciting description!"
              onChange={(e) => setGameDescription(e.target.value)}
            />
            <br></br>
            <label htmlFor="tags">Add some tags: </label>
            <input
              type="text"
              id="tags"
              value={tags}
              placeholder="wizards, magic, frosting"
              onChange={(e) => setTags(e.target.value)}
            />
            <br></br>
            <select value={genre} onChange={handleGenreChange}>
        <option value="">--Please choose a genre--</option>
        {genres.map((genre) => (
          <option key={genre} value={genre.toLowerCase()}>
            {genre}
          </option>
        ))}
      </select>
            <br></br>
            
            <label htmlFor="nsfw">Mark as NSFW: </label>
            <input
              type="checkbox"
              id="nsfw"
              checked={isNsfw}
              onChange={(e) => setIsNsfw(e.target.checked)}
            />
            <br></br>
            <div className="ButtonDiv">
            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleSave}>Confirm</button>
              </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PublishButton;
