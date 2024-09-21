import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
// firebase would go here but no longer needed
}

//console.log('firebaseConfig: ', firebaseConfig);
const app = null//initializeApp(firebaseConfig);

console.log("Firebase app initialized:", app);

const auth = null//getAuth(app);
console.log("Auth initialized:", auth);

const db = null//getFirestore(app);
console.log("Firestore initialized:", db);

const provider = null//new GoogleAuthProvider();
console.log("Provider initialized:", provider);

export { auth, db, provider };
export const storage = null//getStorage(app);
console.log("Storage initialized:", storage);