const { SlashCommandBuilder } = require('@discordjs/builders');

const ping = new  SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')

const downloadCommand = new SlashCommandBuilder()
    .setName('download')
    .setDescription('Faz o download da música do YouTube')
    .addStringOption(option =>
        option.setName('url')
        .setDescription('URL do vídeo do YouTube')
        .setRequired(true));

module.exports = {ping, downloadCommand}