
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCEQd-JMB8yadbVHRsD8tzEsOkEpZoW4_o",
  authDomain: "mokoni-60253.firebaseapp.com",
  projectId: "mokoni-60253",
  storageBucket: "mokoni-60253.firebasestorage.app",
  messagingSenderId: "477891201995",
  appId: "1:477891201995:web:825377c050eb07f13d044e",
  measurementId: "G-KBE5MYFBY4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
