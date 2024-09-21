import React from 'react';
import { db } from './firebaseConfig';
import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import publishUploadImagesAndGetURLs from './publishImageUploader';
import Filter from 'bad-words';

const publishAdventure = async (
  user,
  adventureName,
  authorName,
  adventureFormData,
  adventureID,
  imageData,
  tags,
  additionalCharacters,
  isNsfw,
  genre,
  justShare,
  gameDescription
) => {
  if (user) {
    const filter = new Filter();
    const userId = user.uid;
    const adventuresRef = collection(db, justShare ? 'sharedAdventures' : 'publishedAdventures');
    const adventureDocRef = doc(db, justShare ? 'sharedAdventures' : 'publishedAdventures', adventureID);
    const adventureDoc = await getDoc(adventureDocRef);


    async function uploadImageFromBlobURL(blobUrl,i) {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      // Use the correct MIME type here, e.g., 'image/gif' for GIFs
      //const fileType = blob.type;
      const tempArray = await publishUploadImagesAndGetURLs("public", adventureID, [blob], i);
      return tempArray[0];
    }

    let existingData = {};
      var imageURLs;
         // if (querySnapshot.empty) {
            //handling image uploading including cases where there is a mix of saved and unsaved images
    var imageURLs = [];
    console.log(imageData);
    for(let i = 0; i < imageData.length; i++) {
      if (imageData[i].startsWith('blob:')) {
        imageURLs[i] = await uploadImageFromBlobURL(imageData[i],i);
      }else{
        if(imageData[i][0] == "i") {
            const convertedImageArray = base64ToBlob(imageData[i],'image/png');
            const tempArray = await publishUploadImagesAndGetURLs("public",adventureID,[convertedImageArray],i);
            imageURLs[i] = tempArray[0];
        }else if(imageData[i][0]=='/') {
          imageURLs[i] = imageData[i]
    }else {
          const tempArray = await publishUploadImagesAndGetURLs("public",adventureID,[imageData[i]],i);
            imageURLs[i] = tempArray[0];
        }
    }
    if (adventureDoc.exists()) {
      existingData = adventureDoc.data();
    }
  }

    const searchString = `${tags} ${adventureName} ${authorName} ${adventureFormData.name1} ${adventureFormData.name2} ${adventureFormData.gametype}`
      .toLowerCase()
      .split(/[^\w']+/, -1)
      .filter(Boolean);

    const newAdventure = {
      userID: userId,
      adventureName: filter.clean(adventureName) || "Mystery Adventure",
      authorName: filter.clean(authorName) || '',
      tags: tags || '',
      adventureID: adventureID,
      adventureFormData: adventureFormData,
      shared: justShare ? true : false,
      published: justShare ? false : true,
      images: imageURLs,
      createdAt: existingData.createdAt || Date.now(),
      playCount: existingData.playCount || 0,
      likeCount: existingData.likeCount || 0,
      searchString: searchString ||"na",
      isNsfw: [isNsfw],
      additionalCharacters: additionalCharacters || [],
      gameDescription: gameDescription || '',
      genre: genre ? genre : '',
    };

    // If adventure exists, update; otherwise, create new
    if (adventureDoc.exists()) {
      await setDoc(adventureDocRef, newAdventure, { merge: true });
    } else {
      await setDoc(adventureDocRef, newAdventure, {merge: true });
    }

    console.log('Adventure Published');
  } else {
    console.error('User not authenticated');
  }
};
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




export default publishAdventure
