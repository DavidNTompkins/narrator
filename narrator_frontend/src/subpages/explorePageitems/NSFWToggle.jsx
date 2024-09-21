import {React,useEffect} from 'react';
import { getFirestore, doc, setDoc } from "firebase/firestore"; 

function NsfwToggleButton({ adventureID, initialIsNsfw, canModify }) {
  const [isNsfw, setIsNsfw] = React.useState(initialIsNsfw); // this is a boolean

 const toggleNsfw = async () => {
  if (window.confirm("Are you sure you want to change the NSFW status?")) {
    try {
      console.log(initialIsNsfw, adventureID,isNsfw);
      const db = getFirestore();
      await setDoc(doc(db, "publishedAdventures", adventureID), {
        isNsfw: !isNsfw ? ['NSFW'] : ['notNSFW']
      }, { merge: true });
      console.log('updated nsfw setting. Thanks for modding!')
      setIsNsfw(prevState => !prevState);
    } catch (error) {
      console.error("Error updating the NSFW flag: ", error);
    }
  }
};

  useEffect(() => {
    console.log('nsfwtoggle Mounted/Updated');

    return () => {
      console.log('nsfwtoggle Unmounted');
    };
  }, []);

  return (
    canModify && (
      <p className="mod-nsfw-button" onClick={toggleNsfw}>
        Mark {isNsfw ? 'Safe' : 'NSFW'}
      </p>
    )
  );
}

export default NsfwToggleButton;
