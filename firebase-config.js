// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOP4_K16CIRimF81ksN3Zh2Bj0y7b-WmA",
  authDomain: "nameofproject-61854.firebaseapp.com",
  projectId: "nameofproject-61854",
  storageBucket: "nameofproject-61854.firebasestorage.app",
  messagingSenderId: "770774605935",
  appId: "1:770774605935:web:1287f4797b413ccf582d9a",
  measurementId: "G-ZG767KPXVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);