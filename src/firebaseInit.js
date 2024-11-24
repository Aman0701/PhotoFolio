// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app"; // Import the function to initialize the Firebase app
import { getFirestore } from 'firebase/firestore'; // Import the function to access Firestore database

// TODO: Add SDKs for Firebase products that you want to use
// For more information on available libraries, visit: 
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiqMIj3AK4oLNi-oWQNiDN8YkpnHEoJP4", // Your API key
  authDomain: "photofolio-bae79.firebaseapp.com", // Your app's authentication domain
  projectId: "photofolio-bae79", // Your Firebase project ID
  storageBucket: "photofolio-bae79.firebasestorage.app", // Your Firebase storage bucket
  messagingSenderId: "817664792080", // Your messaging sender ID
  appId: "1:817664792080:web:c43865a258a35d2b819c95" // Your app ID
};

// Initialize Firebase with the configuration object
const app = initializeApp(firebaseConfig);

// Initialize Firestore database and export it for use in other parts of the application
export const db = getFirestore(app);