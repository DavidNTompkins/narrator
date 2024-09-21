import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import 'firebase/compat/storage';
//import fetch from 'node-fetch';

const storage = null // getStorage();

const publishUploadImagesAndGetURLs = async (userId, adventureID, imageData,offset=0) => {
  const imageURLs = [];
  
for (const [index, image] of imageData.entries()) {
  let uploadData;

  if (typeof image === 'string' && image.startsWith('http')) {
    // Image is a URL - fetch the data
    const response = await fetch(image);
    uploadData = await response.blob();
  } else if (image instanceof Blob) {
    // Image is a Blob - use it directly
    uploadData = image;
  } else {
    // Skip this item if it's not a URL or Blob
    continue;
  }

  // Define the new reference
  const imageRef = ref(storage, `users/public/adventures/${adventureID}/image-${index+offset}`);

  // Start the resumable upload
  const uploadTask = uploadBytesResumable(imageRef, uploadData);

  await new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.error('Error uploading image:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        imageURLs.push(downloadURL);
        resolve();
      },
    );
  });
}


  return imageURLs;
};

export default publishUploadImagesAndGetURLs;
