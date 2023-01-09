const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const fs = require('fs')
const client = require('..')
const fract = require('../fract')

module.exports = {
  async respond(interaction) {
    if (interaction.isChatInputCommand()) {
      client.slashCommands.get(interaction.commandName).run(client, interaction)
    } else if (interaction.isButton()) {
      console.log(interaction.customId)
      if (interaction.customId === 'modal:script') {
        const modal = new ModalBuilder()
          .setCustomId(`script:${interaction.user.id}`)
          .setTitle('Code Editor')

        const script = new TextInputBuilder()
          .setCustomId('script')
          .setLabel('JavaScript')
          .setStyle(TextInputStyle.Paragraph)

        const row = new ActionRowBuilder().addComponents(script)

        modal.addComponents(row)
        interaction.showModal(modal)
      }
    } else if (interaction.isModalSubmit()) {
      const input = interaction.fields.getTextInputValue('script')
      let ouput
      const data = fs.readFileSync('data.fjs', 'utf-8')
      let code = fract(data.split(/\/\/[ ]?\$[ ]*/g)[1], interaction)
      try {
        const exe = (new Function(`${code}; ${input}`))
        output = exe().toString() // improve by showing types etc
      } catch (e) {
        output = e.stack.split('\n').splice(0, 3).join('\n')
      }
      await interaction.reply({ content: (output) ? output : 'Your code did not return anything!', ephemeral: true })
    }
  }
}