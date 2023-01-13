async function postClaimedParticle(
    firebaseKey,
    accessKey,
    nickname,
) {

    const currentDB = document.getElementById('db-holder').innerText;
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