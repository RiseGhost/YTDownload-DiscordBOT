const { joinVoiceChannel } = require('@discordjs/voice');

function connect(message){
    const channel = message.member.voice.channel
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false //Premite com que o bot entre sem estar mutado
    })
}

module.exports = { connect }