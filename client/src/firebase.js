// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-ecb75.firebaseapp.com",
  projectId: "mern-auth-ecb75",
  storageBucket: "mern-auth-ecb75.appspot.com",
  messagingSenderId: "1060562562753",
  appId: "1:1060562562753:web:57de7d0577ac774b86ee40"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);