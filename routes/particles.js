const path = require("path");
const express = require('express');
const router = express.Router();
const fbh = require(path.join(__dirname, '../helpers/FirebaseHelper'));
const yth = require(path.join(__dirname, '../helpers/YoutubeHelper'));

const REESE = 'reese';
const CHARLIE = 'charlie';

router.get('/reese', async (req, res) => {
    const subscriberCount = await yth.getYouTubeSubCount(
        process.env.YOUTUBE_API_KEY_REESE,
        process.env.YOUTUBE_USER_REESE
    );
    const numberParticlesInDB = await fbh.getTotalParticleCount(REESE);
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        fbh.createUnclaimedParticles(newParticlesToMake, subscriberCount, REESE);
    }

    const particles = await fbh.getAllParticles(REESE);
    res.render('index', {particles: particles, currentDb: REESE});
});

router.get('/charlie', async (req, res) => {
    const subscriberCount = await yth.getYouTubeSubCount(
        process.env.YOUTUBE_API_KEY_CHARLIE,
        process.env.YOUTUBE_USER_CHARLIE
    );
    const numberParticlesInDB = await fbh.getTotalParticleCount(CHARLIE);
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        fbh.createUnclaimedParticles(newParticlesToMake, subscriberCount, CHARLIE);
    }

    const particles = await fbh.getAllParticles(CHARLIE);
    res.render('index', {particles: particles, currentDb: CHARLIE});
});

router.post('/claim-particle', (req, res) => {
    const { firebaseKey, accessKey, nickname, currentDB} = req.body;
    fbh.claimParticle(firebaseKey, accessKey, nickname, currentDB);
    return res.status(200).send({status: 'claimed'});
});

module.exports = router