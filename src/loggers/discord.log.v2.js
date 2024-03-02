'use strict';

const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require('discord.js');

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = process.env.DISCORD_CHANNEL_ID;

    this.client.on('ready', readyClient => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    this.client.login(process.env.DISCORD_TOKEN);
  }

  /**
   *
   * @param {Object} logData
   * @param {} logData.code
   * @param {} logData.title
   * @param {} logData.message
   */
  sendToFormatCode(logData) {
    const {
      code,
      message = 'This is some additional information about the code.',
      title = 'Code Example',
    } = logData;

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle(title)
      .setDescription('```json\n' + JSON.stringify(code, null, 2) + '\n```');

    const codeMessage = {
      content: message,
      embeds: [embed],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message = '') {
    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.error("Couldn't find the channel ", this.channelId);
    }

    channel.send(message).catch(err => {
      console.error(err);
    });
  }
}

const loggerService = new LoggerService();

module.exports = loggerService;
