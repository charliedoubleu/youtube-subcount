exports.getYouTubeSubCount = async (youtubeApiKey, youtubeUserKey) => {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youtubeUserKey}&key=${youtubeApiKey}`);
    const responseJson = await response.json();
    return responseJson["items"][0].statistics.subscriberCount;
}