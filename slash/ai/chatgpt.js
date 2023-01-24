const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')
const chatgpt = require('../../openai/chatgpt')

module.exports = {
  name: 'chatgpt',
  description: "Display a user's avatar!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: 'prompt',
      description: 'The prompt for ChatGPT!',
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],
  run: async (client, interaction, ...args) => {
    const user = interaction.user
    const prompt = interaction.options.get('prompt').value
    const seconds = 5

    const embed = new EmbedBuilder()
      .setTitle('ChatGPT')
      .setDescription(prompt)
      .setThumbnail('https://brandlogovector.com/wp-content/uploads/2023/01/ChatGPT-Icon-Logo-PNG.png')
      .setColor('#12a37f')

    return interaction.reply({ content: `Generating your response in ${seconds} seconds!`, embeds: [embed] }).then(m => {
      const collector = m.createMessageComponentCollector({ time: seconds * 1000 })

      chatgpt.say(prompt).then(completion => {
        console.log(completion.data.choices)
        return interaction.editReply({ content: completion.data.choices[0].text })
      })

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          console.log('timeout')
        }
      })
    })
  }
}