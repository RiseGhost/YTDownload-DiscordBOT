const yt = require('ytdl-core');
const discordyt = require('ytdl-core-discord')
const { createAudioResource } = require('@discordjs/voice');

const audioOptions = {
    filter: 'audioonly',
    quality: 'highestaudio'
}

/* Desconmentar caso queira ter feedback de download
audioStream.on('progress', (chunkLength, downloaded, total) => {
    const percent = Math.round((downloaded / total) * 100);
    console.log(`Download em andamento: ${percent}%`);
})
*/

async function getmusic(url){
    try {
        await yt.getBasicInfo(url)
        return yt(url, audioOptions)
    } catch (error) {
        return -1
    }
}

async function getYouTubeResource(url){
    try {
        return createAudioResource(await discordyt(url))
    } catch (error) {
        return -1
    }
}

module.exports = {
    getmusic,
    audioOptions,
    getYouTubeResource
}