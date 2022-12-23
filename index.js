// imports
const express = require('express');
const app = express();
const path = require("path");
const firebase = require("firebase/app");
const firebaseDB = require("firebase/database");
const mustacheExpress = require('mustache-express');

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

    const particlesWithKeys = Object.entries(particlesSnapshot.val()).map((entry) => {
        let firebaseKey = entry[0];
        let particleData = entry[1];
        return {... particleData, key: firebaseKey};
    });
    return particlesWithKeys;
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

// home view
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/static/index.html"));
});

app.get('/particles', async (req, res) => {
    // TODO: get this number properly from youtube api based on a key
    const subscriberCount = 12;
    const numberParticlesInDB = await getTotalParticleCount();
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        createUnclaimedParticles(newParticlesToMake, subscriberCount);
    }

    const particles = await getAllParticles();
    res.render('particles', {particles: particles});
});

app.listen(
    3000,
    () => console.log(`Listening on port 3000 ... `)
);