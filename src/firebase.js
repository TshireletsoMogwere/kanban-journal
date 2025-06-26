import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiL33zJEW93kYGfbAqHP49PM57-5R1Mxw",
  authDomain: "kanban-journal-51530.firebaseapp.com",
  projectId: "kanban-journal-51530",
  storageBucket: "kanban-journal-51530.firebasestorage.app",
  messagingSenderId: "665169577171",
  appId: "1:665169577171:web:e4f10939a6d8300daa4026"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
