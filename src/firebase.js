


// // src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyAOmzZOvWkMeBhJNWwNPKsHOz8p8VXSQqA",
  authDomain: "event-3843c.firebaseapp.com",
  projectId: "event-3843c",
  storageBucket: "event-3843c.firebasestorage.app",
  messagingSenderId: "385075081725",
  appId: "1:385075081725:web:53e91c1fd08c504c086994",
  measurementId: "G-914BJ7GWVT"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
