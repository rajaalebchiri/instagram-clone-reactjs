import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB_w0P0MCY36sR0qWV0h2gYwjogarm0828",
    authDomain: "instagrame-clone-798da.firebaseapp.com",
    databaseURL: "https://instagrame-clone-798da.firebaseio.com",
    projectId: "instagrame-clone-798da",
    storageBucket: "instagrame-clone-798da.appspot.com",
    messagingSenderId: "868184022143",
    appId: "1:868184022143:web:93edb57d878348c739734a",
    measurementId: "G-1ERY43TTXX"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };