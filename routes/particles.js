const path = require("path");
const express = require('express');
const router = express.Router();
const firebaseHelper = require(path.join(__dirname, '../helpers/FirebaseHelper'));
const youtubeHelper = require(path.join(__dirname, '../helpers/YoutubeHelper'));

router.get('/', async (req, res) => {
    const subscriberCount = await youtubeHelper.getYouTubeSubCount(
        process.env.YOUTUBE_API_KEY_REESE,
        process.env.YOUTUBE_USER_REESE
    );
    const numberParticlesInDB = await firebaseHelper.getTotalParticleCount();
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        firebaseHelper.createUnclaimedParticles(newParticlesToMake, subscriberCount);
    }

    const particles = await firebaseHelper.getAllParticles();
    res.render('particles', {particles: particles});
});

router.get('/reese', async (req, res) => {
    const subscriberCount = await youtubeHelper.getYouTubeSubCount(
        process.env.YOUTUBE_API_KEY_REESE,
        process.env.YOUTUBE_USER_REESE
    );
    const numberParticlesInDB = await firebaseHelper.getTotalParticleCount();
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        firebaseHelper.createUnclaimedParticles(newParticlesToMake, subscriberCount);
    }

    const particles = await firebaseHelper.getAllParticles();
    res.render('index', {particles: particles});
});

router.get('/charlie', async (req, res) => {
    const subscriberCount = await youtubeHelper.getYouTubeSubCount(
        process.env.YOUTUBE_API_KEY_CHARLIE,
        process.env.YOUTUBE_USER_CHARLIE
    );
    const numberParticlesInDB = await firebaseHelper.getTotalParticleCount();
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        firebaseHelper.createUnclaimedParticles(newParticlesToMake, subscriberCount);
    }

    const particles = await firebaseHelper.getAllParticles();
    res.render('index', {particles: particles});
});

router.post('/claim-particle', (req, res) => {
    const { firebaseKey, accessKey, nickname } = req.body;
    firebaseHelper.claimParticle(firebaseKey, accessKey, nickname);
    return res.status(200).send({status: 'claimed'});
});

module.exports = router