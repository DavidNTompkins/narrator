import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs,query, where } from 'firebase/firestore';
//import { db } from '../firebaseConfig'; // assuming your firebase instance is initialized in this file
import { BiImport } from 'react-icons/bi'
import urlToBase64 from '../URLtoBaseSixtyFour';

const ImportCharacterWindow = ({ handleCharacterImport, retrievedAdventures, setRetrievedAdventures, user,type }) => {
  const [showWindow, setShowWindow] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState(null);
  const [filteredAdventures, setFilteredAdventures] = useState([]);


  const fetchData = async () => {
      if (retrievedAdventures.length === 0) {
        const db = getFirestore();
        const q = query(collection(db, 'adventures'), where('userID', '==', user.uid));

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());
        setRetrievedAdventures(data);
      }
    };
  // filtering by type
  useEffect(() => {
  if (Array.isArray(retrievedAdventures)) {
    const filteredData = retrievedAdventures.filter(adventure => {
      // Check for additionalCharacters array existence before accessing it
      if (type !== 'character' && adventure.additionalCharacters) {
        return adventure.additionalCharacters.some(char => char.type === type);
      }
      return type === 'character';
    });
    setFilteredAdventures(filteredData);
  } else {
    setFilteredAdventures([]);
  }
}, [retrievedAdventures, type]);


  const handleRowClick = (adventure) => {
    if (selectedAdventure==adventure){
      setSelectedAdventure("null");
    }else{
      setSelectedAdventure(adventure);
    }
  };

  const handleImportClick = (newName, newRole, newBackground, newDescription,image) => {
    urlToBase64(image)
    .then(image64 => {
    handleCharacterImport(newName, newRole, newBackground, newDescription,image64.split(',')[1]);
    setSelectedAdventure(null);
    setShowWindow(false);
    })
  };

  return (
    <>
      <button type='button' className="import-button" onClick={() => {setShowWindow(true);
                                                                      fetchData()}}> <BiImport /> <span className="tooltiptext">Import Saved Character</span> </button>
      {showWindow && (
        <div className="import-popup" onClick={() => setShowWindow(false)}>
          <p style={{margin:'0.5em'}}>Import from Saved Game</p>
          <button className="close-button" onClick={()=>setShowWindow(false)}>x</button>
          <div className="scrollable-inset" onClick={(e) => e.stopPropagation()}>
            {filteredAdventures.length == 0 ? <p style={{color:'white',textAlign:'center'}}>No Characters / Content Found!</p> : 
            filteredAdventures.map((adventure) => (
              <div key={adventure.adventureName} className="adventure" onClick={() => handleRowClick(adventure)}>
                <p className="adventure-name">{adventure.adventureName}</p>
                {selectedAdventure === adventure && (
                  <div className="character-container">

                    {type==="character" && <>
                    <div className="character-details">
                    <p>{adventure.adventureFormData.name1}</p>
                    <button type='button' className="import-character-button" onClick={() => handleImportClick(adventure.adventureFormData.name1, adventure.adventureFormData.race1,adventure.adventureFormData.class1,adventure.adventureFormData.background1, adventure.images[0])}>Import</button>
                      </div>
                    
                    {adventure.adventureFormData.name2 && <div className="character-details"><> <p>{adventure.adventureFormData.name2}</p>
                    <button type='button' className="import-character-button" onClick={() => handleImportClick(adventure.adventureFormData.name2, adventure.adventureFormData.race2,adventure.adventureFormData.class2,adventure.adventureFormData.background2,adventure.images[1])}>Import</button> </></div>}</>}
                      
                    {adventure.additionalCharacters &&
                    adventure.additionalCharacters.map((char, index) => (
                      (!char.type || char.type===type) &&
                      <div key={index} className="character-details">
                        <p>{char.name}</p>
                        <button type='button' className="import-character-button" onClick={() => handleImportClick(char.name, char.role, char.background, char.description, adventure.images[index + 1 + (adventure.adventureFormData.name2 ? 1 : 0)])}>Import</button>
                      </div>
                    ))}
                  
                  </div>
                    )}
                    
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ImportCharacterWindow;
