const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const counterpart = require('../slash/utility/avatar')

module.exports = {
  name: counterpart.name,
  description: counterpart.description,
  cooldown: counterpart.cooldown,
  args: counterpart.options,
  aliases: ['ava'],
  run: (message, args, client, ...extras) => {
    counterpart.run(client, message, args[0])
  }
}