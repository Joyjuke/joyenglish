import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCEW_L_4Sq-fCJjo66hTxREUIcEbcjXvgo",
  authDomain: "joyenglish-40a8e.firebaseapp.com",
  projectId: "joyenglish-40a8e",
  storageBucket: "joyenglish-40a8e.firebasestorage.app",
  messagingSenderId: "732483026981",
  appId: "1:732483026981:web:4c4ed03fa259d161937fcc",
  measurementId: "G-YP2PHN8KJK"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics는 개발 환경에서는 사용하지 않음
// let analytics;
// if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
//   analytics = getAnalytics(app);
// }

export { app, auth, db }; 