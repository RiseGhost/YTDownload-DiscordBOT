const { Client, GatewayIntentBits, VoiceChannel } = require('discord.js');
const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildVoiceStates, //Talk voice
        ]
    });
const { createAudioPlayer } = require('@discordjs/voice');
const json = require('./data.json')
const ProjectInfo = require('./package.json')
const fs = require('fs')
const music = require('./models/Music')
const commands = require('./commands/commands.js');
const VoiceConnect = require('./models/VoiceConnect')

//npm i ffmpeg-static | @discordjs/opus

//Recebe como argumento uma mensagem e devolve o url da message (!play url)
function getURL(message) { return message.content.split(/\s+/)[1] }

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //Adicionar SlashCommands (/)
    Object.values(commands).forEach((command) => {
        client.application.commands.create(command)
    })
});

const player = createAudioPlayer()

//Evento para a deteção dos SlashCommands (/)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'ping') interaction.reply('Pong!');
    else if (commandName === 'about') interaction.reply('```json\n' + JSON.stringify(ProjectInfo).toString() + '\n```')
    else if (commandName === 'download') {
        music.getmusic(options.get('url').value).then((audioStream) => {
            if (audioStream != -1) {
                interaction.reply("Download started successfully ✅")
                audioStream.pipe(fs.createWriteStream('./music/' + interaction.id + '.mp3'));
                audioStream.on('end', () => {
                    const message = interaction.channel
                    message.send({ files: ['./music/' + interaction.id + '.mp3'] }).then(() => { fs.unlinkSync('./music/' + interaction.id + '.mp3') })
                        .catch((err) => console.log(err))
                });
            }
            else interaction.reply("Err ❌")
        })
    }
    else if (commandName === "call") {
        if (options.get('language') == null) interaction.reply(json['bot-data']['CALL-MSG'] + options.get('game').value + '?')
        else if (options.get('language').value == 'pt') interaction.reply(json['bot-data']['CALL-MSGPT'] + options.get('game').value + '?')
        else if (options.get('language').value == 'es') interaction.reply(json['bot-data']['CALL-MSGES'] + options.get('game').value + '?')
        else if (options.get('language').value == 'fr') interaction.reply(json['bot-data']['CALL-MSGFR'] + options.get('game').value + '?')
        else if (options.get('language').value == 'it') interaction.reply(json['bot-data']['CALL-MSGIT'] + options.get('game').value + '?')
        else interaction.reply(json['bot-data']['CALL-MSG'] + options.get('game').value + '?')
    }
    else if (commandName === "play") {
        if (!interaction.member.voice.channel) return interaction.reply("Err ❌")
        const connection = VoiceConnect.connect(interaction)
        connection.subscribe(player)
        const resource = await music.getYouTubeResource(options.get('url').value)
        if (resource != -1) player.play(resource)
        else {
            connection.destroy()
            interaction.reply('Err URL ❌')
            return
        }
        interaction.reply("Playing Music 🎵")
    }
    else if (commandName === "pause") {
        player.pause()
        interaction.reply("Music pause ⏸️")
    }
    else if (commandName === "resume") {
        player.unpause()
        interaction.reply("Music play")
    }
});

//Eventos de deteção de messagem criadas
client.on('messageCreate', async function (message) {
    if (message.content == "ping") message.reply("pong")
    if (message.content == "puta") message.reply("quero <3")
    if (message.content.substring(0, 5) == "!play") {
        if (!message.member.voice.channel) return message.reply("Err ❌")
        const connection = VoiceConnect.connect(message)
        if (!connection || !connection.state.status === 'ready') {
            return message.reply('Could not connect to the voice channel!');
        }          
        connection.subscribe(player)
        const resource = await music.getYouTubeResource(getURL(message))
        if (resource != -1) player.play(resource)
        else {
            connection.destroy()
            message.reply('Err URL ❌')
        }
    }
    if (message.content == "!pause") player.pause()
    if (message.content == "!resume") player.unpause()

})

player.on('error', error => {
    console.error(`Erro ❌`);
    console.log(error)
});

client.login(json['bot-data'].TOKEN);
