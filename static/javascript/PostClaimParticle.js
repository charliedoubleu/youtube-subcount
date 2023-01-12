async function postClaimedParticle(
    firebaseKey,
    accessKey,
    nickname,
    currentDB,
) {
    
    const res = await fetch(
        '/particles/claim-particle',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firebaseKey: firebaseKey,
                accessKey: accessKey,
                nickname: nickname,
                currentDB: currentDB
            })
        }
    );
}