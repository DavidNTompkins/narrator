import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import 'firebase/compat/storage';

const storage = getStorage();

const uploadImagesAndGetURLs = async (userId, adventureID, imageData,offset=0) => {
  const imageURLs = [];

  for (const [index, image] of imageData.entries()) {
    if(image=="skip"){}else{
    const imageRef = ref(storage, `users/${userId}/adventures/${adventureID}/image-${index+offset}`);
    const uploadTask = uploadBytesResumable(imageRef, image);

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
  }}

  return imageURLs;
};

export default uploadImagesAndGetURLs;
