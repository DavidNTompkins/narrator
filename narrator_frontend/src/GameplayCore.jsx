import React from 'react';
import AvatarComponent from "./AvatarComponent.jsx"
import EditableImage from './smallScripts/EditableImage.jsx';
import AddCharacterIcon from './smallScripts/AddCharacterIcon.jsx';
import AddWorldIcon from './smallScripts/AddWorldIcon.jsx';
import Subtitles from './subtitles.jsx'
import { useHallucination } from './hallucinator/HallucinationContext';
import ShowCharacters from './hallucinator/ShowCharacters.jsx'

// Import any other necessary components or libraries

const GameplayCore = ({
  abortController,
  activeTimeouts,
  additionalCharacters,
  additionalCharactersOffset,
  adventureID,
  AISpokeLast,
  background,
  bakedCharacters,
  browser,
  characters,
  clearAllTimeouts,
  description,
  editableTextlog,
  formData,
  handleCharacterActivation ,
  handleCharacterDelete,
  handleCharacterEdit,
  handler,
  hyperionFlag,
  hyperionNeeded,
  hyperionSummary,
  imageData,
  inactive,
  index,
  isPrimaryCharacter,
  isStreamActive,
  keyboard,
  messages,
  mobile,
  name,
  prompts,
  retrievedAdventures,
  role,
  save,
  setAbortController,
  setAdditionalCharacters,
  setEditableTextlog,
  setHandler,
  setHyperionFlag,
  setHyperionNeeded,
  setHyperionSummary,
  setImageData,
  setIsStreamActive,
  setMessages,
  setRetrievedAdventures,
  setSnapshots,
  setStatus,
  setTextlog,
  snapshots,
  speaker,
  status,
  textlog,
  timeoutIdsRef,
  tokenFlag,
  transVisible,
  useBaked,
  user,
  utterancesRef,
  downgraded=false,
  setDowngraded=null

}) => {

  const { hallucinationOn } = useHallucination(); // Assuming your context provides these

    return (
      <> 
      <div className="avatars" style = {{
        width: mobile ? transVisible ? "90vw":"":""?"":"",
      gridTemplateRows: (mobile && hallucinationOn) ? '10% 90%':null}}>
        <AvatarComponent prompts={prompts} 
          characters={characters} 
          messages={messages} 
          setMessages={setMessages} 
          imageData={imageData} 
          setImageData={setImageData} 
          handler={handler} 
          setHandler={setHandler} 
          setStatus={setStatus} 
          browser={browser} 
          formData={formData} 
          textlog={textlog} 
          setTextlog={setTextlog} 
          editableTextlog={editableTextlog} 
          setEditableTextlog={setEditableTextlog} 
          transVisible={transVisible} 
          mobile={mobile} 
          keyboard={keyboard} 
          speaker = {speaker} 
          hyperionSummary={hyperionSummary} 
          setHyperionSummary={setHyperionSummary} 
          hyperionFlag={hyperionFlag} 
          setHyperionFlag={setHyperionFlag} 
          user={user} 
          save={save} 
          adventureID={adventureID} 
          utterancesRef={utterancesRef} 
          additionalCharacters={additionalCharacters} 
          bakedCharacters={bakedCharacters} 
          useBaked={useBaked} 
          hyperionNeeded={hyperionNeeded} 
          setHyperionNeeded={setHyperionNeeded} 
          AISpokeLast={false} 
          abortController={abortController} 
          setAbortController={setAbortController} 
          isStreamActive={isStreamActive} 
          setIsStreamActive={setIsStreamActive} 
          timeoutIdsRef={timeoutIdsRef}
          />
        {(hallucinationOn && mobile) ? <ShowCharacters/> :
        <div id="avatars">
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
        />
          {additionalCharactersOffset>1 && <EditableImage
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
        />}
           {additionalCharacters.map((char, index) => (
            (!char.type || char.type==="character") &&
          <EditableImage
          imageData={imageData}
          setImageData={setImageData}
          index={index+additionalCharactersOffset}
          name={char.name}
          role={char.role}
          background={char.background}
          description={char.description}
          mobile={mobile}
          transVisible={transVisible}
          handleEdit={handleCharacterEdit}
          handleDelete={handleCharacterDelete}
            user={user}
            handleCharacterActivation = {handleCharacterActivation}
          inactive={char.inactive}
          retrievedAdventures={retrievedAdventures}
          setRetrievedAdventures={setRetrievedAdventures}
          key={index}
            type={"character"}
        />
      ))}
          {!mobile && <br></br>}

          {(additionalCharacters.length<11) && <div className="add-icon-div">
            {['character'].map((type,index)=> (
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
      description: "Mid range portrait of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, square picture, centered subject",
      type:type,
      key:index,
      },
      ]);
      }}
      >
      {type==="character" ? <AddCharacterIcon /> : <AddWorldIcon />}
      </button>))} 
           </div>}
           {additionalCharacters.map((char, index) => (
            (char.type==="world") &&
          <EditableImage
          imageData={imageData}
          setImageData={setImageData}
          index={index+additionalCharactersOffset}
          name={char.name}
          role={char.role}
          background={char.background}
          description={char.description}
          mobile={mobile}
          transVisible={transVisible}
          handleEdit={handleCharacterEdit}
          handleDelete={handleCharacterDelete}
            user={user}
            handleCharacterActivation = {handleCharacterActivation}
          inactive={char.inactive}
          retrievedAdventures={retrievedAdventures}
          setRetrievedAdventures={setRetrievedAdventures}
          key={index}
            type={'world'}

        />
      ))}
          {!mobile && <br></br>}

          {(additionalCharacters.length<11) && <div className="add-icon-div">
            {['world'].map((type,index)=> (
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
      description: "Beautiful landscape art of (put your prompt here) high quality artwork trending award-winning, exquisite, detailed, stunning, square picture, centered subject",
      type:type,
      key:index,
      },
      ]);


      }}
      >
      {type==="character" ? <AddCharacterIcon /> : <AddWorldIcon />}
      </button>))} 
           </div>}
      </div>}

         <Subtitles 
           textlog={textlog} 
           editableTextlog={editableTextlog}
           mobile={mobile} 
           transVisible={transVisible} 
           keyboard={keyboard} 
           status={status}
           formData={formData} 
           handler={handler} 
           setHandler={setHandler} 
           setTextlog={setTextlog} 
           setEditableTextlog={setEditableTextlog} 
           hyperionFlag={hyperionFlag} 
           setHyperionFlag={setHyperionFlag} 
           messages={messages} 
           setMessages={setMessages}
           setStatus={setStatus} 
           hyperionSummary={hyperionSummary} 
           imageData={imageData} 
           setImageData={setImageData} 
           additionalCharacters={additionalCharacters} 
           tokenFlag={tokenFlag} 
           bakedCharacters={bakedCharacters} 
           useBaked={useBaked} 
           hyperionNeeded={hyperionNeeded} 
           setHyperionNeeded={setHyperionNeeded} 
           speaker={speaker} 
           setSnapshots={setSnapshots} 
           snapshots={snapshots} 
           abortController={abortController} 
           setAbortController={setAbortController} 
           isStreamActive={isStreamActive} 
           setIsStreamActive={setIsStreamActive} 
           timeoutIdsRef={timeoutIdsRef} 
           utterancesRef={utterancesRef} 
           clearAllTimeouts={clearAllTimeouts} 
           activeTimeouts={activeTimeouts}
           downgraded={downgraded}
           setDowngraded={setDowngraded}/>
      </div>
          </>
    );
};

export default GameplayCore;