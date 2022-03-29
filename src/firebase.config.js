import {getFirestore} from 'firebase/firestore'
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpFeu1AjcxKxS-spQNCxODiUpqUdeT8zI",
  authDomain: "vinyl-marketplace-app.firebaseapp.com",
  projectId: "vinyl-marketplace-app",
  storageBucket: "vinyl-marketplace-app.appspot.com",
  messagingSenderId: "283834203030",
  appId: "1:283834203030:web:089c6686014be46f827bb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()