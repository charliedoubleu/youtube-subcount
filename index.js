// imports
const express = require('express');
const app = express();
const path = require("path");
const firebase = require("firebase/app");
const firebaseDB = require("firebase/database");
require('dotenv').config()

// set up and initialize firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseDB.getDatabase(firebaseApp);

// set a fun new thing
firebaseDB.set(firebaseDB.ref(database, 'test/'), {
    username: 'hello reese',
});

// home view
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/static/index.html"));
});

const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`Listening on port ${port}... `))