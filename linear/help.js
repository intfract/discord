const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const counterpart = require('../slash/bot/help')

module.exports = {
  name: counterpart.name,
  description: counterpart.description,
  cooldown: counterpart.cooldown,
  args: counterpart.options,
  aliases: [],
  run: (message, args, client, ...extras) => {
    console.log('LINEAR')
  }
}