const path = require("path");
const express = require('express');
const { getHeapCodeStatistics } = require("v8");
const router = express.Router();
const firebaseHelper = require(path.join(__dirname, '../helpers/FirebaseHelper'));

async function getYouTubeSubCount() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${process.env.YOUTUBE_USER}&key=${process.env.YOUTUBE_API_KEY}`);
    const responseJson = await response.json();
    return responseJson["items"][0].statistics.subscriberCount;
}

router.get('/', async (req, res) => {
    const subscriberCount = await getYouTubeSubCount();
    const numberParticlesInDB = await firebaseHelper.getTotalParticleCount();
    const newParticlesToMake = subscriberCount - numberParticlesInDB;

    if (newParticlesToMake > 0){
        firebaseHelper.createUnclaimedParticles(newParticlesToMake, subscriberCount);
    }

    const particles = await firebaseHelper.getAllParticles();
    res.render('particles', {particles: particles});
});

router.get('/live-demo', async (req, res) => {
    const subscriberCount = await getYouTubeSubCount();
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