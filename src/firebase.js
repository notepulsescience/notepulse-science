
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAv11D30fxrgTWngXa2adfyxj6obcliJvo",
  authDomain: "notepulse-science-8ac1f.firebaseapp.com",
  projectId: "notepulse-science-8ac1f",
  storageBucket: "notepulse-science-8ac1f.firebasestorage.app",
  messagingSenderId: "639984581568",
  appId: "1:639984581568:web:985dac0c736418b3906625"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const auth = getAuth(app);
// Secondary Auth for creating Co-Admin accounts
const adminCreationApp = initializeApp(firebaseConfig, "AdminCreation");
export const adminCreationAuth = getAuth(adminCreationApp);

export const googleProvider = new GoogleAuthProvider();
