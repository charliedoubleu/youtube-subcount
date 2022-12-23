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

function createUnclaimedParticles(numberOfParticles, subscriberCount) {

    // if we are creating unclaimed particles the subscriber count has grown
    firebaseDB.update(firebaseDB.ref(database, 'metadata/'), {
        total_count_particles: subscriberCount
    });

    for(var i=0; i < numberOfParticles; i++){
        firebaseDB.push(firebaseDB.ref(database, 'particles/'), {
            nickname: "",
            claimed: false,
            access_key: ""
        });
    }
}

async function getTotalParticleCount() {
    const totalCountsRef = firebaseDB.ref(database, 'metadata/total_count_particles');
    const totalCountSnapshot = await firebaseDB.get(totalCountsRef, (snapshot) => {
        return snapshot;
    });
    return totalCountSnapshot.val();
}

async function getAllParticles() {
    const particlesRef = firebaseDB.ref(database, 'particles');
    const particlesSnapshot = await firebaseDB.get(particlesRef, (snapshot) => {
        return snapshot;
    });
    return particlesSnapshot.val();
}

// home view
app.get('/', async (req, res) => {
    // TODO: get this number properly from youtube api based on a key
    const subscriberCount = 11;
    const numberParticlesInDB = await getTotalParticleCount();
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        createUnclaimedParticles(newParticlesToMake, subscriberCount);
    }

    const particles = await getAllParticles();

    res.sendFile(path.join(__dirname, "views/static/index.html"));
});

app.listen(
    3000,
    () => console.log(`Listening on port 3000 ... `)
);