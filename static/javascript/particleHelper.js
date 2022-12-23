async function claimParticleWithHardCodedData(
    firebaseKey,
    accessKey,
    nickname,
) {
    const res = await fetch(
        '/particles/claim-particle',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firebaseKey: firebaseKey,
                accessKey: accessKey,
                nickname: nickname
            })
        }
    );
}