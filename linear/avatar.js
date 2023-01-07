const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const counterpart = require('../slash/utility/avatar')

module.exports = {
  name: counterpart.name,
  description: counterpart.description,
  cooldown: counterpart.cooldown,
  options: counterpart.options,
  aliases: ['ava'],
  run: (message, args, client, ...extras) => {
    if (args[0] && /<@[0-9]+>/g.test(args[0])) {
      counterpart.run(client, message, ...args)
    } else {
      message.reply(`An invalid argument was provided out of ${counterpart.options.length} argument${(counterpart.options.length === 1) ? '' : 's'}`)
    }
  }
}