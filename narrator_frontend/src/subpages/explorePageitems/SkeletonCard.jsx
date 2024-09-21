import {React,useEffect,useState} from 'react';
import LinkButton from '../../smallScripts/LinkButton.jsx';
import Rating from './Rating.jsx';
import GameInfoPopup from './GameInfoPopup.jsx';

//import NsfwToggleButton from '../subpages/explorePageitems/NSFWToggle.jsx';

const SkeletonCard = ({ adventureID, adventureName, authorName,playCount,likeCount,owned,adventureFormData,index,onButtonClick, additionalCharacters, onDelete,userRole,NSFW,userID, user, authorId, setAuthorId,owner,setLastVisible,gameDescription, imageData, onUpdateModel }) => {

  
  return (
    <div className="card">
      
      <div className="card-images">
        <div className="character-image-container">
        <div style={{height:'8.6em'}}></div>
        <p className="photo-name skeleton-text">...loading</p>
          </div>
       <div className="character-image-container">
         <div style={{height:'8.6em'}}></div>
         <p className="photo-name skeleton-text">...loading</p>
          </div>
      </div>
      
      <div className="card-info">
        <h3>...loading</h3>
        
        <button className="card-button">...loading</button>
       <div style={{margin:'auto'}}> <select className="adventure-model-select"  value={ 'GPT 4o-Mini'}>
        
  
        </select> </div>
        
        <div><p style={{ display: 'inline' }}>...loading </p> <p className="author-name"> {'authorName'}</p></div>
        
      </div>
      <div className="card-stats">
        <p>...loading</p>
        <Rating adventureId={'adventureID'} userId={'userID'} user={'user'} />
        {/* <span>Likes: {likeCount}</span> */}
      </div>
      
      
      <LinkButton id={'adventureID'} />
      <GameInfoPopup gameInfo={'gameInfo'} /> 
      
    </div>
  );
};

export default SkeletonCard;