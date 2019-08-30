import firebase from "firebase";

// Replace the values below with your Firebase config

var firebaseConfig = {
    apiKey: "yourAPIKeyHere",
    authDomain: "yourauthDomainHere",
    databaseURL: "yourdatabaseURLHere",
    projectId: "yourprojectIdHere",
    storageBucket: "yourstorageBucketHere",
    messagingSenderId: "yourmessagingSenderIdHere",
    appId: "yourappIdHere"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;
