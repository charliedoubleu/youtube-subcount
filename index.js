// imports
require('dotenv').config()
const express = require('express');
const app = express();
const path = require("path");
const firebase = require("firebase/app");
const firebaseDB = require("firebase/database");
const mustacheExpress = require('mustache-express');

// imports written by us
const firebaseHelper = require(path.join(__dirname, 'helpers/FirebaseHelper'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.set("static", path.join(__dirname, "static"));
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(express.json());
app.engine('mustache', mustacheExpress());

// home view
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "static/html/index.html"));
});

app.get('/particles', async (req, res) => {
    // TODO: get this number properly from youtube api based on a key
    const subscriberCount = 12;
    const numberParticlesInDB = await firebaseHelper.getTotalParticleCount();
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        firebaseHelper.createUnclaimedParticles(newParticlesToMake, subscriberCount);
    }

    const particles = await firebaseHelper.getAllParticles();
    res.render('particles', {particles: particles});
});

app.post('/particles/claim-particle', (req, res) => {
    const { firebaseKey } = req.body;
    console.log(firebaseKey);
    return res.status(200).send({status: 'claimed'});
});

app.listen(
    3000,
    () => console.log(`Listening on port 3000 ... `)
);