import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDgKgaz3ceGG4pu1jgAryxREEsNbNPD8Tw",
    authDomain: "todo-e4647.firebaseapp.com",
    projectId: "todo-e4647",
    storageBucket: "todo-e4647.appspot.com",
    messagingSenderId: "94802913569",
    appId: "1:94802913569:web:6c3347a4ff393d9c10b660",
    measurementId: "G-JGBZSDVG3G"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


export default firebase;