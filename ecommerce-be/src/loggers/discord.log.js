'use strict';

const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// const token = process.env.DISCORD_TOKEN;
const token =
  'MTE5MzQyNjcyMzI5MTc5MTQ3MQ.GKEFid.K8HOP9bIZKf_gLSnjCKjc70RNIorNQYUakLG9w';

client.login(token);

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if ((message.content = 'Hello')) {
    message.reply('Helo anh, elm nà Quìn! Em giúp gì được cho anh nhỉ anh iu?');
  }
});
