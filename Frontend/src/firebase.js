// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-badbc.firebaseapp.com",
  projectId: "real-estate-badbc",
  storageBucket: "real-estate-badbc.appspot.com",
  messagingSenderId: "693226627633",
  appId: "1:693226627633:web:1c72a37a3387b8db872b10",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
