import {React,useEffect,useState} from 'react';
import {getImageUrl} from './firebaseHelpers';
import LinkButton from './LinkButton.jsx';
import DeletePublishedButton from '../subpages/explorePageitems/DeletePublishedButton.jsx';
import Rating from '../subpages/explorePageitems/Rating.jsx';
import GameInfoPopup from '../subpages/explorePageitems/GameInfoPopup.jsx';
import EditButton from '../subpages/explorePageitems/EditButton.jsx'
import sayAWord from './sayAWord.js'


//import NsfwToggleButton from '../subpages/explorePageitems/NSFWToggle.jsx';

const AdventureCard = ({ adventureID, adventureName, authorName,playCount,likeCount,owned,adventureFormData,index,onButtonClick, additionalCharacters, onDelete,userRole,NSFW,userID, user, authorId, setAuthorId,owner,setLastVisible,gameDescription, imageData, browser, mobile, onUpdateModel }) => {

  const [imageURL1,set1] = useState('');
  const [imageURL2,set2] = useState('');
  const [displayedSRC, setDisplayedSRC] = useState([])
  const [charIndex, setCharIndex] =useState(0);
  const handleModelChange = (event) => {
    onUpdateModel(event.target.value);
  };
  const handleMouseOver = () => {
   // setDisplayedSRC(['image_assets/testing/will.webp','image_assets/testing/sam.webp']); // animatedSrc can also be a .webp file
  };

  const handleMouseOut = () => {
    //setDisplayedSRC([imageURL1,imageURL2]);
  };
  
  const gameInfo = gameDescription ? {
    name: adventureName,
    description: gameDescription
  } :
    {
      name: adventureName,
      description: `In this ${adventureFormData.gametype} game, you play as ${adventureFormData.name1}. \n\n
${adventureFormData.setting ? `Starting Location: ${adventureFormData.setting} \n\n` :''}
${adventureFormData.storyhook ? `Story Hook: ${adventureFormData.storyhook}`: ''}`
    };

    function sortByAuthor() {
      if(authorId){
        setAuthorId('');
        setLastVisible(null)
      } else{
        setAuthorId(authorName)
        setLastVisible(null)
      }
    }

  const handleImageError = (e, fallbackUrl) => {
    e.target.src = fallbackUrl;
  };

  const modelOptions = [
    { name: 'GPT 4o-Mini (smartest)', value: 'GPT 4o-Mini', tier: 'gold' },
    { name: 'Dolphin Mixtral (newest)', value: 'Dolphin Mixtral', tier: 'gold' },
    { name: 'Hermes Mixtral', value: 'Hermes Mixtral', tier: 'gold' },
    { name: 'MythoMax 13b', value: 'MythoMax 13b', tier: 'gold' },
    { name: 'Toppy', value: 'Toppy', tier: 'silver' },
    { name: 'Hermes 7b', value: 'Hermes' , tier: 'silver'},
    { name: 'Hermes 13b', value: 'Hermes 13b', tier: 'silver'},
    { name: 'Open Orca', value: 'Open Orca' , tier: 'silver'},
    { name: 'Open 3.5', value: 'Open 3.5' , tier: '#cd7f32'},
    //{ name: 'Zephyr', value:'Zephyr', tier: '#cd7f32'},
    //{ name: 'Mixtral', value: 'Mixtral' },
    { name: 'MythoMist 7b (NSFW capable-ish)', value: 'MythoMist 7b', tier: '#cd7f32' },
    
    
  ];
useEffect(() => {
    console.log('adventurecard Mounted/Updated');

    return () => {
      console.log('adventurecard Unmounted');
    };
  }, []);
  
  var firstLoad = true;
useEffect(() => {
        const fetchResizedImage = async () => {
          firstLoad= false;
            try {
              console.log("how many of these?")
              
              var tempIndex = !adventureFormData.name2 ? additionalCharacters ? additionalCharacters.findIndex(
            character => character.type === 'character' || !character.hasOwnProperty('type')
              ) :0 :0;
              if(tempIndex===-1){tempIndex+=1}
              setCharIndex(tempIndex);


                const tempimageURL1 = adventureFormData.name1 ? await getImageUrl(`/users/public/adventures/${adventureID}/image-0`) : ''
                const tempimageURL2 = (adventureFormData.name2||additionalCharacters.length>0) ? await  getImageUrl(`/users/public/adventures/${adventureID}/image-${tempIndex+1}`) : ''
                set1(tempimageURL1);
                set2(tempimageURL2);
                setDisplayedSRC([tempimageURL1,tempimageURL2]);
            } catch (error) {
                console.error('Error fetching resized image URL:', error);
            }
        };

        if(firstLoad) fetchResizedImage();
    }, []);
    
  
  
  return (
    <div className={NSFW=="NSFW" ? "red-card" : "card"} 
      style={{border:(NSFW=="NSFW" && 'solid 1px red')}}  
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      >
      
      <div className="card-images">
        {adventureFormData.name1 && <div className="character-image-container" 
                                      style={{margin:
                                        (!adventureFormData.name2 && additionalCharacters.length==0) ? 'auto' : null}}>
        <img src={displayedSRC[0]} alt="First Character" onError={(e) => handleImageError(e, imageData[0] )} />
        <p className="photo-name">{adventureFormData.name1}</p>
          </div>}
        {(adventureFormData.name2 || additionalCharacters.length>0) && <div className="character-image-container">
        <img src={displayedSRC[1]} alt="Second Character" onError={(e) => handleImageError(e, imageData[1] )}  />
        <p className="photo-name">{adventureFormData.name2 ? adventureFormData.name2 : additionalCharacters[charIndex] ? additionalCharacters[charIndex].name :"" }</p>
          </div>}
      </div>
      
      <div className="card-info">
        <h3>{adventureName}</h3>
        <div className="adventure-button-div">
        <button className="card-button" onClick={(e) => onButtonClick(e,index,"text")}>Play Text</button>
        {browser!="safari" && !mobile && <button className="card-button card-button2" onClick={(e) => {sayAWord('a'); onButtonClick(e,index,"image")}}>Play Image/Audio</button>}
        </div>
       <div style={{margin:'auto'}}> <select className="adventure-model-select" onChange={handleModelChange} value={adventureFormData.model || 'Open 3.5'}>
        
         {modelOptions.map((option, index) => (
           <option key={index} value={option.value} style={{color:option.tier}}>{option.name}</option>
         ))}
        </select> </div>
        
        <div><p style={{ display: 'inline' }}>Adventure by: </p> <p className="author-name" onClick={sortByAuthor}> {authorName}</p></div>
        
      </div>
      <div className="card-stats">
        <p>Plays: {playCount}</p>
        <Rating adventureId={adventureID} userId={userID} user={user} />
        {/* <span>Likes: {likeCount}</span> */}
      </div>
      {owned && <DeletePublishedButton adventureID={adventureID} onDelete={onDelete}/>}
      {owned && <EditButton editLink={`https://playnarrator.com/adventure/${adventureID}/public/editing`}/>}
      {false && (userRole==="mod") && <NsfwToggleButton adventureID={adventureID} initialIsNsfw={NSFW=="NSFW"} canModify={userRole==="mod"} /> }
      <LinkButton id={adventureID} />
      <GameInfoPopup gameInfo={gameInfo} /> 
      
    </div>
  );
};

export default AdventureCard;