// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0qlO1xqt9WZCC30eecPrIBaq8uVHsrqg",
  authDomain: "test-auth-29875.firebaseapp.com",
  projectId: "test-auth-29875",
  storageBucket: "test-auth-29875.appspot.com",
  messagingSenderId: "1000416869553",
  appId: "1:1000416869553:web:1400fc86cfe238b7607690",
  measurementId: "G-10Y1D4V4LY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);