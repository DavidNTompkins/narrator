import React, { useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DownloadAdventureButton = ({ paramID, isPublic, prompt }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Fetch adventure data
      const db = getFirestore();
      let adventureRef;
      if (isPublic === "public") {
        adventureRef = doc(db, 'publishedAdventures', paramID);
      } else if (isPublic === "shared") {
        adventureRef = doc(db, 'sharedAdventures', paramID);
      } else {
        adventureRef = doc(db, 'adventures', paramID);
      }
      
      const adventureSnap = await getDoc(adventureRef);
      
      if (!adventureSnap.exists()) {
        console.error('No such adventure!');
        setIsDownloading(false);
        return;
      }
      
      const adventureData = adventureSnap.data();
      
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Add adventure data as JSON
      zip.file('adventure_data.json', JSON.stringify(adventureData, null, 2));
      
      // Add prompt as a text file
      zip.file('prompt.txt', (prompt+"\n\n"+ `game start, setting: ${adventureData.adventureFormData.setting}. ${adventureData.adventureFormData.storyhook}`));
      
      // Fetch and add images
      const storage = getStorage();
      const imageData = adventureData.images || [null, null];
      
      for (let i = 0; i < imageData.length; i++) {
        if (imageData[i]) {
          try {
            const imageRef = ref(storage, imageData[i]);
            const imageUrl = await getDownloadURL(imageRef);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            zip.file(`image_${i + 1}.jpg`, blob);
          } catch (error) {
            console.error(`Error fetching image ${i + 1}:`, error);
          }
        }
      }
      
      // Generate zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save and download the zip file
      saveAs(content, `adventure_${paramID}.zip`);
    } catch (error) {
      console.error('Error downloading adventure:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      style={{marginLeft:"5px"}} 
      className="startButton" 
      onClick={handleDownload}
      disabled={isDownloading}
      type="button"
    >
      {isDownloading ? "DOWNLOADING! Hold on..." : "Download Adventure"}
    </button>
  );
};

export default DownloadAdventureButton;