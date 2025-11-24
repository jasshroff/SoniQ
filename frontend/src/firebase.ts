import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔴 YOUR ACTUAL FIREBASE KEYS
const firebaseConfig = {
  apiKey: "AIzaSyA61vKb1E_KKILaTtgIyGBTbWMXk_pGYZk", 
  authDomain: "soniq-auth.firebaseapp.com",
  projectId: "soniq-auth",
  storageBucket: "soniq-auth.firebasestorage.app",
  messagingSenderId: "113652471442",
  appId: "1:113652471442:web:e9c86baae0449a4ba3f84b",
  measurementId: "G-MBSWPTGPXC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();