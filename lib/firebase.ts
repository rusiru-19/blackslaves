import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyA-JBbh9CIidrrbzUTP6kplS4cFn7Ol2gM",
  authDomain: "blackslaves-b8550.firebaseapp.com",
  projectId: "blackslaves-b8550",
  storageBucket: "blackslaves-b8550.firebasestorage.app",
  messagingSenderId: "451487522895",
  appId: "1:451487522895:web:e70f113ecf617596328a3a",
  measurementId: "G-VV91GDT2EQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);