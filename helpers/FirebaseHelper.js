const firebase = require("firebase/app");
const firebaseDB = require("firebase/database");

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

exports.createUnclaimedParticles = (numberOfParticles, subscriberCount) => {
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

exports.getTotalParticleCount = async () => {
    const totalCountsRef = firebaseDB.ref(database, 'metadata/total_count_particles');
    const totalCountSnapshot = await firebaseDB.get(totalCountsRef, (snapshot) => {
        return snapshot;
    });
    return totalCountSnapshot.val();
}

exports.getAllParticles = async () => {
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