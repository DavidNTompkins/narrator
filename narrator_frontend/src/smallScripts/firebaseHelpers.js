import { getFirestore, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { storage } from './firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

export const incrementField = async (collectionName, docId, fieldName) => {
  const db = getFirestore();
  const docRef = doc(db, collectionName, docId);

  try {
    await updateDoc(docRef, { [fieldName]: increment(1) });
    console.log(`Field "${fieldName}" incremented successfully`);
  } catch (error) {
    console.error(`Error updating field "${fieldName}": `, error);
  }
};

export const setTrue = async (collectionName, docId, fieldName) => {
  const db = getFirestore();
  const docRef = doc(db, collectionName, docId);

  try {
    await updateDoc(docRef, { [fieldName]: true });
    console.log(`Field "${fieldName}" incremented successfully`);
  } catch (error) {
    console.error(`Error updating field "${fieldName}": `, error);
  }
};

export const getImageUrl = (originalImagePath, width=200, height=200) => {
        const resizedImagePath = `${originalImagePath}_${width}x${height}`;
        try {
            const url = getDownloadURL(ref(storage, resizedImagePath));
            return url;
        } catch (error) {
            console.error('Error fetching resized image URL:', error);
            return null;
        }
    };


export const isShared = async (uuid) => {
  const db = getFirestore();
  try {
    const docRef = doc(db, 'adventures', uuid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().shared;
    } else {
      console.log("No such document!");
      return false;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return false;
  }
}

