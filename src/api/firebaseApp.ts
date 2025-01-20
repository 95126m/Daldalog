import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFxp8pCDxeMWJwFs_xd2qL73ONnjaGjLU",
  authDomain: "daldalog.firebaseapp.com",
  projectId: "daldalog",
  storageBucket: "daldalog.appspot.com",
  messagingSenderId: "945032510408",
  appId: "1:945032510408:web:b780068e38e40386d79efd",
  measurementId: "G-96E83EW0Y7",
};

// Initialize Firebase (prevent duplicate initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
