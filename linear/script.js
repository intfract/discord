const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
  name: 'script',
  description: 'Creates a script that the bot can execute!',
  cooldown: 3000,
  options: [],
  aliases: [],
  run: async (message, args, client, ...extras) => {
    const modal = new ModalBuilder()
      .setCustomId(`script:${message.author.id}`)
      .setTitle('Code Editor')

    const script = new TextInputBuilder()
      .setCustomId('script')
      .setLabel('JavaScript')
      .setStyle(TextInputStyle.Paragraph)

    const row = new ActionRowBuilder().addComponents(script)

    modal.addComponents(row)
    await message.showModal(modal)
  }
}