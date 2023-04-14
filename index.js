const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
const json = require('./data.json')
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
const yt = require('ytdl-core');
const commands = require('./commands/commands.js')

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    await client.application.commands.create(commands.ping)
    await client.application.commands.create(commands.downloadCommand);
});

client.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName, options } = interaction;
  
    if (commandName === 'ping') interaction.reply('Pong!');
    if (commandName === 'download') interaction.reply("Hello")
});

client.on('messageCreate', async function(message){
    //console.log(message.content)
    if(message.content == "ping") message.reply("pong")
    if(message.content == "puta") message.reply("quero <3")
    if(message.content == "foto") message.reply({ files : ["./1.jpg"] });
    if(message.content.split(' ')[0] == "download"){
        // URL do vídeo do YouTube
        const videoUrl = message.content.split(' ')[1];

        // Opções para o download do áudio
        const audioOptions = {
        filter: 'audioonly',
        quality: 'highestaudio',
        };

        const audioStream = yt(videoUrl, audioOptions)
        
        audioStream.on('progress', async (chunkLength, downloaded, total) => {
            const percent = Math.round((downloaded / total) * 100);
            console.log(`Download em andamento: ${percent}%`);
        })
        audioStream.on('end', () => {
            message.reply({ files: ['./music/' + message.id + '.mp3'] }).then(() => { fs.unlinkSync('./music/' + message.id + '.mp3') })
        });
        audioStream.pipe(fs.createWriteStream('./music/' + message.id + '.mp3'));
    }
})

client.login(json['bot-data'].TOKEN);