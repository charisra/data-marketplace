import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyDapT1keNJAcKYd3Zs04i_fZH4jGdcmSzg",
    authDomain: "narrative-51c3a.firebaseapp.com",
    databaseURL: "https://narrative-51c3a.firebaseio.com",
    projectId: "narrative-51c3a",
    storageBucket: "narrative-51c3a.appspot.com",
    messagingSenderId: "1093404319127",
    appId: "1:1093404319127:web:bdc5592dad6a23a5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;