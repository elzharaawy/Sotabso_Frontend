import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJXvD5qoe0OKp6haIUqYRp8PHCeYNc2j0",
  authDomain: "blogsite-a9422.firebaseapp.com",
  projectId: "blogsite-a9422",
  storageBucket: "blogsite-a9422.firebasestorage.app",
  messagingSenderId: "72978927146",
  appId: "1:72978927146:web:0219a9ba8b2f5a0a503d53"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export const authWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result; // return full userCredential
  } catch (err) {
    console.error("Firebase Google Auth Error:", err);
    throw err;
  }
};
