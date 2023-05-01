//Implementação dos SlashCommands (/)
const { SlashCommandBuilder } = require('@discordjs/builders');

const ping = new  SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')

const downloadCommand = new SlashCommandBuilder()
    .setName('download')
    .setDescription('Faz o download da música do YouTube')
    .addStringOption(option =>
        option.setName('url')
        .setDescription('YouTube URL')
        .setRequired(true));

const about = new SlashCommandBuilder()
    .setName('about')
    .setDescription('Mostra a informação do projeto do bot')

const call = new SlashCommandBuilder()
    .setName('call')
    .setDescription('Send a message calling people to play')
    .addStringOption(option => 
        option.setName('game')
        .setDescription('Game Name')
        .setRequired(true))
    .addStringOption(option =>
        option.setName('language')
        .setDescription('Choose menssage language')
        .setRequired(false))

const play = new SlashCommandBuilder()
    .setName('play')
    .setDescription('play music')
    .addStringOption(option =>
        option.setName('url')
        .setDescription('YouTube URL')
        .setRequired(true))

const pause = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('pause music')

const resume = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('resume music')

module.exports = {ping, downloadCommand, about, call, play, pause, resume}