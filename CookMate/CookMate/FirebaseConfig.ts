// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqfCPfjQvYQc0kDUTXSRx3N7Bfonns1Qg",
  authDomain: "cookmate-91376.firebaseapp.com",
  projectId: "cookmate-91376",
  storageBucket: "cookmate-91376.firebasestorage.app",
  messagingSenderId: "700829734101",
  appId: "1:700829734101:web:7367438865db6fe15f7e5c",
  measurementId: "G-KVSTVM39WV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
