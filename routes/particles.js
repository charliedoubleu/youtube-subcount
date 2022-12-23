const path = require("path");
const express = require('express');
const router = express.Router();
const firebaseHelper = require(path.join(__dirname, '../helpers/FirebaseHelper'));

router.get('/', async (req, res) => {
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

router.post('/claim-particle', (req, res) => {
    const { firebaseKey, accessKey, nickname } = req.body;
    firebaseHelper.claimParticle(firebaseKey, accessKey, nickname);
    return res.status(200).send({status: 'claimed'});
});

module.exports = router