const client = require('..')

module.exports = {
  respond(interaction) {
    if (interaction.isChatInputCommand()) {
      client.slashCommands.get(interaction.commandName).run(client, interaction)
    } else if (interaction.isButton()) {
      console.log(interaction.customId)
    }
  }
}