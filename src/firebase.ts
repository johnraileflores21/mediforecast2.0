import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCk6Y_MSza5pHDfhyWvyRDLf_TUy6CIIig",
    authDomain: "mediforecast.firebaseapp.com",
    projectId: "mediforecast",
    storageBucket: "mediforecast.appspot.com",
    messagingSenderId: "21849469834",
    appId: "1:21849469834:web:0bf772ebe2b5d49f828e73",
    measurementId: "G-CXL601F8WV"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };