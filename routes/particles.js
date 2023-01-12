const path = require("path");
const express = require('express');
const router = express.Router();
const fbh = require(path.join(__dirname, '../helpers/FirebaseHelper'));
const yth = require(path.join(__dirname, '../helpers/YoutubeHelper'));

router.get('/reese', async (req, res) => {
    const subscriberCount = await yth.getYouTubeSubCount(
        process.env.YOUTUBE_API_KEY_REESE,
        process.env.YOUTUBE_USER_REESE
    );
    const numberParticlesInDB = await fbh.getTotalParticleCount('reese');
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        fbh.createUnclaimedParticles(newParticlesToMake, subscriberCount, 'reese');
    }

    const particles = await fbh.getAllParticles('reese');
    res.render('index', {particles: particles});
});

router.get('/charlie', async (req, res) => {
    const subscriberCount = await yth.getYouTubeSubCount(
        process.env.YOUTUBE_API_KEY_CHARLIE,
        process.env.YOUTUBE_USER_CHARLIE
    );
    const numberParticlesInDB = await fbh.getTotalParticleCount('charlie');
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        fbh.createUnclaimedParticles(newParticlesToMake, subscriberCount, 'charlie');
    }

    const particles = await fbh.getAllParticles('charlie');
    res.render('index', {particles: particles});
});

router.post('/claim-particle', (req, res) => {
    const { firebaseKey, accessKey, nickname, currentDB} = req.body;
    fbh.claimParticle(firebaseKey, accessKey, nickname, currentDB);
    return res.status(200).send({status: 'claimed'});
});

module.exports = router