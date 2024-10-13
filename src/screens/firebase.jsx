// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
 import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB9FYPAWEHCanYgYk-I8Uh_GQfmFf0F8AI",
    authDomain: "csse-b3d36.firebaseapp.com",
    projectId: "csse-b3d36",
    storageBucket: "csse-b3d36.appspot.com",
    messagingSenderId: "74900451739",
    appId: "1:74900451739:web:1a3df1a93785673ce6b13e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);

export default app;