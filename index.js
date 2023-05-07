const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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
const commands = require('./commands/commands.js')
const VoiceConnect = require('./models/VoiceConnect')
const List = require('./models/List')
const SplitList = [',', ';', '/', ' ']



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
    if (message.content.substring(0, 4) == "list"){
        const input = List.format(message.content.replace("list", ''))
        var NumberList = []
        var ListType
        var SortList
        List.List(input, SplitList, NumberList)
        if (input == '' || NumberList.toString() == '') return message.reply("Err ❌\nInvalid values")

        if (List.isNumericList(NumberList)) ListType = "numeric"
        else ListType = "string"

        const Embed = new EmbedBuilder()
	    .setColor(0xfafa02)
	    .setTitle('**List: ⛓️**')
	    .setAuthor({ name: json['bot-data'].Name, iconURL: 'attachment://hera.png', url: 'https://github.com/RiseGhost/YTDownload-DiscordBOT' })
	    .setDescription('List info:')
        .addFields(
            { name: 'Original List ', value: NumberList.toString() },
            { name: 'Sort List', value: (ListType == "numeric") ? NumberList.sort((a,b) => a - b).toString() : NumberList.sort().toString() },
            { name: '\u200B', value: '\u200B' },
            { name: 'Type List ', value: ListType, inline: true },
            { name: 'List size', value: NumberList.length.toString(), inline: true },
            { name: 'Max value', value: NumberList[NumberList.length - 1].toString(), inline: true },
            { name: 'Average', value: List.average(NumberList) }
        )
	    .setThumbnail('attachment://hera.png')
	    .setTimestamp()
	    .setFooter({ text: 'Some footer text here', iconURL: 'attachment://hera.png' });

        message.channel.send({ embeds: [Embed], files: ['icons/hera.png'] })
        //message.reply(message.content.replace("list", ''))
    }

})

player.on('error', error => {
    console.error(`Erro ❌`);
    console.log(error)
});

client.login(json['bot-data'].TOKEN);
