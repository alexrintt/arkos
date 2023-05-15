// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth, signInAnonymously } from "firebase/auth";
import { Firestore, collection, getFirestore } from "firebase/firestore";
export {
  getFirestore,
  getDoc,
  getDocs,
  collection,
  doc,
  getDocFromServer,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPJ9HhusJD6zvvGt6AjrbZte4IhZFNUPI",
  authDomain: "arkos-5d4fe.firebaseapp.com",
  projectId: "arkos-5d4fe",
  storageBucket: "arkos-5d4fe.appspot.com",
  messagingSenderId: "413809653299",
  appId: "1:413809653299:web:cb06cbae30eb1725365546",
};

// Initialize Firebase
export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);

export const db: Firestore = getFirestore(firebaseApp);
