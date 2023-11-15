import app from 'firebase/app';
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqwKxiIDkFUZT4RuUjipAidtrkAkNS3z8",
    authDomain: "prog3parte2.firebaseapp.com",
    projectId: "prog3parte2",
    storageBucket: "prog3parte2.appspot.com",
    messagingSenderId: "10375262609",
    appId: "1:10375262609:web:b7675d87fadced8e816a30"
  };
  

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();
