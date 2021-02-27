//eslint-disable-next-line
import firebase from "firebase";
import "firebase/auth";

var app = firebase.initializeApp({
    apiKey: "AIzaSyCw2kmMWyvrNORVjPskW1i93AezL2BZBxs",
    authDomain: "blogcentre-a0b92.firebaseapp.com",
    projectId: "blogcentre-a0b92",
    storageBucket: "blogcentre-a0b92.appspot.com",
    messagingSenderId: "42418295295",
    appId: "1:42418295295:web:e59b29f3b06377c91bd7ca",
    measurementId: "G-X352EJGG0F"
});

export const auth = app.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
export default app;
export const db = app.firestore();  
