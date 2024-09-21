import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const saveOrUpdateAdventure = async (user, adventureName, adventureSummary, adventureFormData, adventureID, imageData, setImageData, additionalCharacters, textlog, lastMessages, bakedCharacters, isPublished = false) => {
  if (user) {
    const userId = user.uid;
    const savedText = getLastNWords(textlog, 20000);

    // Create a new JSZip instance
    const zip = new JSZip();

    // Prepare adventure data
    const adventureData = {
      userID: userId,
      adventureName: adventureName,
      adventureID: adventureID,
      adventureSummary: [{
        text: adventureSummary,
        timestamp: Date.now()
      }],
      adventureFormData: adventureFormData,
      shared: false,
      published: isPublished,
      additionalCharacters: additionalCharacters,
      transcript: savedText,
      lastMessages: lastMessages,
      bakedCharacters: bakedCharacters
    };

    // Add adventure data as JSON
    zip.file('adventure_data.json', JSON.stringify(adventureData, null, 2));

    // Add images
    const imageURLs = [];
    for (let i = 0; i < imageData.length; i++) {
      if (imageData[i]) {
        let imageBlob;
        if (imageData[i][0] !== "i") {
          const response = await fetch(imageData[i]);
          imageBlob = await response.blob();
        } else {
          imageBlob = base64ToBlob(imageData[i], 'image/jpg');
        }
        zip.file(`image_${i + 1}.jpg`, imageBlob);
        imageURLs.push(`image_${i + 1}.jpg`);
      }
    }

    // Update imageData with local file references
   // setImageData(imageURLs);
    adventureData.images = imageURLs;

    // Update the adventure_data.json file with the new image references
    zip.file('adventure_data.json', JSON.stringify(adventureData, null, 2));

    // Generate zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Save and download the zip file
    saveAs(content, `adventure_${adventureID}.zip`);

    console.log('Adventure saved successfully');
  } else {
    console.error('User not authenticated');
  }
};

// Helper function to convert base64 to Blob (unchanged)
const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

// Helper function to get last N words (unchanged)
function getLastNWords(str, n) {
  let words = str.split(' ');
  if (words.length > n) {
    words = words.slice(-n);
  }
  return words.join(' ');
}

export default saveOrUpdateAdventure;