import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDll6UocV7F6zd-4Ny5gJPLpOfc_8S_h_U",
  authDomain: "violetnotes.firebaseapp.com",
  projectId: "violetnotes",
  storageBucket: "violetnotes.firebasestorage.app",
  messagingSenderId: "359356453593",
  appId: "1:359356453593:web:bffb464c78af9b8e23a4c8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
