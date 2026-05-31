import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8Y_ZfX7PhdUYcMpa4a-JhBYaFLJl2IEQ",
  authDomain: "pizza-palace-e3284.firebaseapp.com",
  projectId: "pizza-palace-e3284",
  storageBucket: "pizza-palace-e3284.firebasestorage.app",
  messagingSenderId: "732580750835",
  appId: "1:732580750835:web:e8cb144f9188861889de86"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth;