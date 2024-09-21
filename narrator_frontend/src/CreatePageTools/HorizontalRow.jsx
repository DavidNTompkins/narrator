import React from 'react';
import EditableImage from '../smallScripts/EditableImage.jsx'; 
import './HorizontalRow.css'; 
import AddCharacterIcon from '../smallScripts/AddCharacterIcon.jsx';
import AddWorldIcon from '../smallScripts/AddWorldIcon.jsx';


const HorizontalRow = ({ 
  formData,
  additionalCharacters,
  setAdditionalCharacters,
  imageData,
  setImageData,
  mobile,
  transVisible,
  handleCharacterEdit,
  handleCharacterDelete,
  user,
  handleCharacterActivation,
  additionalCharactersOffset,
  retrievedAdventures,
  setRetrievedAdventures,
  type
}) => {
  return (
    <div className="parent-wrapper">
      {type==="character" ?
    <div className="vertical-text">Characters</div>
        :
    <div className="vertical-text">World Info</div>
      }
    <div className="horizontal-row">

      {type==='character' &&
      <EditableImage
            imageData={imageData}
            setImageData={setImageData}
            index={0}
            name={formData.name1}
            role={formData.race1}
            background={formData.class1}
            description={formData.background1}
            mobile={mobile}
            transVisible={transVisible}
            handleEdit={handleCharacterEdit}
            handleDelete={handleCharacterDelete}
            user={user}
            handleCharacterActivation = {handleCharacterActivation}
            inactive={false}
            retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures}
            isPrimaryCharacter={true}
            type={type}
          />}
      {type==='character' && (formData.name2 !="") &&
            <EditableImage
            imageData={imageData}
            setImageData={setImageData}
            index={1}
            name={formData.name2}
            role={formData.race2}
            background={formData.class2}
            description={formData.background2}
            mobile={mobile}
            transVisible={transVisible}
            handleEdit={handleCharacterEdit}
            handleDelete={handleCharacterDelete}
              user={user}
              handleCharacterActivation = {handleCharacterActivation}
            inactive={false}
            retrievedAdventures={retrievedAdventures}
            setRetrievedAdventures={setRetrievedAdventures}
            isPrimaryCharacter={true}
            type={type}
          />}
      {additionalCharacters.map((char, index) => (
      (char.type===type || (!char.type && type==='character'))  && <EditableImage
          imageData={imageData}
          setImageData={setImageData}
          index={index + additionalCharactersOffset}
          name={char.name}
          role={char.role}
          background={char.background}
          description={char.description}
          mobile={mobile}
          transVisible={transVisible}
          handleEdit={handleCharacterEdit}
          handleDelete={handleCharacterDelete}
          user={user}
          handleCharacterActivation={handleCharacterActivation}
          inactive={char.inactive}
          retrievedAdventures={retrievedAdventures}
          setRetrievedAdventures={setRetrievedAdventures}
          key={index}
          type={type}
        />
      ))}
      {(additionalCharacters.length<11) && <div className="add-icon-div-creator">
            <button className="add-icon-button"
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await setImageData([...imageData,
                 `/${type}/image${Math.floor(Math.random() * 9)}.png`]);
    setAdditionalCharacters([
      ...additionalCharacters,
      {
        name:"", // some thoughts - pass whole thing [indexd] to editableImage? for easier edit? 
        role: "", // Set default or empty values for the new component
        background: "",
        description: type=='char'? "Mid range portrait of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, square picture, centered subject" : "Beautiful landscape art of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, square picture, centered subject",
        type:type,
      },
    ]);
    
  }}
>
              
              {type==="character" ? <AddCharacterIcon /> : <AddWorldIcon />}
</button> 
             </div>}
    </div>
      </div>
  );
};

export default HorizontalRow;
