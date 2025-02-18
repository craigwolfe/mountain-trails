// src/firebase/firebaseconfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCVSUrxiA0ajBOWzYywpZ4MD0TgLFlFnZg",
  authDomain: "outdooradventures-37704.firebaseapp.com",
  projectId: "outdooradventures-37704",
  storageBucket: "outdooradventures-37704.firebasestorage.app",
  messagingSenderId: "20572987277",
  appId: "1:20572987277:web:73eca69d7ac773dcc5e7c4",
  measurementId: "G-TDQ407VTDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth, db, storage };

