const FIREBASE_KEY_ATTRIBUTE = `data-fb-key`;

let unclickedParticles = document.querySelectorAll(`[data-claimed="false"]`);
unclickedParticles.forEach((particle) => {
    particle.addEventListener('click', () => {
        claimParticleWithHardCodedData(particle);
    });
});

async function claimParticleWithHardCodedData(particle) {
    const res = await fetch(
        'http://localhost:3000/particles/claim-particle',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firebaseKey: particle.getAttribute(FIREBASE_KEY_ATTRIBUTE)
            })
        }
    );
}