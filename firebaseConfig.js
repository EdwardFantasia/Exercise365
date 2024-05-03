import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRDVCveAV8J57ywtSDygzhDwCBNTCFHK4",
  authDomain: "exercise365-5b879.firebaseapp.com",
  projectId: "exercise365-5b879",
  storageBucket: "exercise365-5b879.appspot.com",
  messagingSenderId: "530479762994",
  appId: "1:530479762994:web:2d1113e3bff7ded2adb62b",
  measurementId: "G-H9XK63H6XL"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(firebaseApp)
const firestoreDB = getFirestore(firebaseApp)
const firebaseStorage = getStorage(firebaseApp)

module.exports = {
  firebaseApp: firebaseApp,
  firebaseAuth: firebaseAuth, 
  firestoreDB: firestoreDB,
  firebaseStorage: firebaseStorage
}