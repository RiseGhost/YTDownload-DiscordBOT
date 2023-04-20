const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
const json = require('./data.json')
const ProjectInfo = require('./package.json')
const fs = require('fs')
const music = require('./models/Music')
const commands = require('./commands/commands.js')

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //Adicionar SlashCommands (/)
    Object.values(commands).forEach((command) => {
        client.application.commands.create(command)
    })
});

//Evento para a deteção dos SlashCommands (/)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName, options } = interaction; 
  
    if (commandName === 'ping') interaction.reply('Pong!');
    if (commandName === 'about') interaction.reply('```json\n' + JSON.stringify(ProjectInfo).toString() + '\n```')
    if (commandName === 'download'){
        music.getmusic(options.get('url').value).then((audioStream) => {
            if (audioStream != -1){
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
    if (commandName === "call"){
        if (options.get('language') == null) interaction.reply(json['bot-data']['CALL-MSG'] + options.get('game').value + '?')
        else if (options.get('language').value == 'pt') interaction.reply(json['bot-data']['CALL-MSGPT'] + options.get('game').value + '?')
        else if (options.get('language').value == 'es') interaction.reply(json['bot-data']['CALL-MSGES'] + options.get('game').value + '?')
        else if (options.get('language').value == 'fr') interaction.reply(json['bot-data']['CALL-MSGFR'] + options.get('game').value + '?')
        else if (options.get('language').value == 'it') interaction.reply(json['bot-data']['CALL-MSGIT'] + options.get('game').value + '?')
        else interaction.reply(json['bot-data']['CALL-MSG'] + options.get('game').value + '?')
    }
});

client.on('messageCreate', async function(message){
    if(message.content == "ping") message.reply("pong")
    if(message.content == "puta") message.reply("quero <3")
})

client.login(json['bot-data'].TOKEN);