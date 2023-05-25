// Import the functions you need from the SDKs you need
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyrVPf3ZR_xHiD5wPYYiDRBF1PYZjeWYQ",
  authDomain: "chat-app-final-f083e.firebaseapp.com",
  projectId: "chat-app-final-f083e",
  storageBucket: "chat-app-final-f083e.appspot.com",
  messagingSenderId: "742895540774",
  appId: "1:742895540774:web:4bb8e47d55fddb25c5a4e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); 