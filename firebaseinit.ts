// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6GDfHCVtkcAc0aSUrxjVJ1UkQ2OGPOEI",
  authDomain: "twitter-clone-de837.firebaseapp.com",
  projectId: "twitter-clone-de837",
  storageBucket: "twitter-clone-de837.appspot.com",
  messagingSenderId: "235718319491",
  appId: "1:235718319491:web:d70d47a4058363f0f2eab6",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
export const storage = getStorage(app);
export default firestore;
