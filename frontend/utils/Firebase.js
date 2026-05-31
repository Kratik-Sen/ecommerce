import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "logineshop-75b91.firebaseapp.com",
  projectId: "logineshop-75b91",
  storageBucket: "logineshop-75b91.firebasestorage.app",
  messagingSenderId: "742218388573",
  appId: "1:742218388573:web:8b3a3ad2d91b766f0169b4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export{auth,provider}