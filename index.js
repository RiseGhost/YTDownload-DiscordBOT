const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
const json = require('./data.json')
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
const yt = require('ytdl-core');
const commands = require('./commands/commands.js')

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.application.commands.create(commands.ping)
    client.application.commands.create(commands.downloadCommand);
    client.application.commands.create(commands.about)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName, options } = interaction;
  
    if (commandName === 'ping') interaction.reply('Pong!');
    if (commandName === 'download'){
        const videoUrl = options.get('url').value

        const audioOptions = {
            filter: 'audioonly',
            quality: 'highestaudio'
        }

        try {
            await yt.getBasicInfo(videoUrl)
            interaction.reply("Download started successfully ✅")
            const audioStream = yt(videoUrl, audioOptions)

            audioStream.on('progress', (chunkLength, downloaded, total) => {
                const percent = Math.round((downloaded / total) * 100);
                console.log(`Download em andamento: ${percent}%`);
            })
            audioStream.on('end', () => {
                const message = interaction.channel
                message.send({ files: ['./music/' + interaction.id + '.mp3'] }).then(() => { fs.unlinkSync('./music/' + interaction.id + '.mp3') })
                .catch((err) => console.log(err))
            });
            audioStream.pipe(fs.createWriteStream('./music/' + interaction.id + '.mp3'));
        } catch (error) {
            interaction.reply("Err ❌")
        }
    }
});

client.on('messageCreate', async function(message){
    //console.log(message.content)
    if(message.content == "ping") message.reply("pong")
    if(message.content == "puta") message.reply("quero <3")
    if(message.content == "foto") message.reply({ files : ["./1.jpg"] });
})

client.login(json['bot-data'].TOKEN);