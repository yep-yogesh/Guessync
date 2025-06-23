import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAHl8NL3rl8e_J-g2yeuA-HvXr1TEg1mKo",
    authDomain: "not-guessync.firebaseapp.com",
    projectId: "not-guessync",
    storageBucket: "not-guessync.firebasestorage.app",
    messagingSenderId: "1093122716556",
    appId: "1:1093122716556:web:65a5822960ed903bfd5ca9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
