import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBK2pPxo1UvJ4qA31qJgC2Rnf0q6JOgS4k",
  authDomain: "raising2004-160b9.firebaseapp.com",
  databaseURL: "https://raising2004-160b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "raising2004-160b9",
  storageBucket: "raising2004-160b9.appspot.com",
  messagingSenderId: "1059702426042",
  appId: "1:1059702426042:web:7739e8f1a9343e171df583",
  measurementId: "G-435KSNG1S2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
