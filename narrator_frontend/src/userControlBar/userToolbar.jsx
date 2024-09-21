import React from "react";
import Login from "./logIn";
import { v4 as uuidv4 } from 'uuid';
import saveOrUpdateAdventure from '../adventure'
import hyperion from '../hyperion'
import {FaRegSave} from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import SaveButton from "./saveButton";


const Toolbar = ({formData,save,setSave,user,setUser,messages,adventureID,setAdventureID,hyperionSummary,setHyperionSummary,setHyperionFlag,auth,provider,imageData,setImageData,isPublished,additionalCharacters,textlog,setTextlog,hyperionNeeded,setHyperionNeeded,editableTextlog,bakedCharacters}) => {
  return (
    <div style={toolbarStyle}>
      {formData &&
     <SaveButton formData={formData} save={save} setSave={setSave} user={user} setUser={setUser} messages={messages} adventureID={adventureID} setAdventureID={setAdventureID} hyperionSummary={hyperionSummary} setHyperionSummary={setHyperionSummary} setHyperionFlag={setHyperionFlag} auth={auth} provider={provider} imageData={imageData} setImageData={setImageData} additionalCharacters={additionalCharacters} isPublished={isPublished} textlog={textlog} setTextlog={setTextlog} hyperionNeeded ={hyperionNeeded} setHyperionNeeded ={setHyperionNeeded} editableTextlog={editableTextlog} bakedCharacters={bakedCharacters}/>}
       {//<Login user={user} setUser={setUser} auth={auth} provider={provider} />
} 
<a href="https://x.com/davidNTompkins/" target="_blank" style={{color:'white'}}><FaXTwitter /> </a>

    </div>
  );
};

const toolbarStyle = {
  //position: "fixed",
  display: "flex",
  alignItems: "center",
  height: "60px",
  margin:0,
  padding: "0 20px",
  backgroundColor: "#004040",
  zIndex: 999,
  border: "2px solid #007a7a",
  borderRadius: '5px',
};
export default Toolbar;
