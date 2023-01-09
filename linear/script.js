const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
  name: 'script',
  description: 'Creates a script that the bot can execute!',
  cooldown: 3000,
  options: [],
  aliases: [],
  run: async (message, args, client, ...extras) => {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Open Editor')
          .setStyle('Success')
          .setCustomId('modal:script')
      )
    message.reply({ content: 'Open your script editor!', components: [row] })
  }
}