const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'trivia',
  description: "Answer some trivia questions!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  run: async (client, interaction) => {
    let seconds = 20
    const data = [
      {
        question: 'Who is the richest person in the world?',
        choices: [
          'Jeff Bezos',
          'Elon Musk',
          'Steve Jobs',
          'Larry Page',
        ],
        answer: 1,
        category: 'People',
        difficulty: 'Medium',
      },
      {
        question: 'What is an API?',
        choices: [
          'Augmented Pixel Interactions',
          'Advanced Program Installation',
          'Algorithm Processing Internet',
          'Application Programming Interface',
        ],
        answer: 3,
        category: 'Computer Science',
        difficulty: 'Medium',
      },
    ]

    const trivia = data[Math.floor(Math.random() * data.length)]

    // Trivia Question Embed 

    const user = interaction.user

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag, icon: user.displayAvatarURL({ size: 256 }), })
      .setTitle(`Trivia`)
      .setDescription(`**${trivia.question}**`)
      .setColor('#2f3136')
      .setFooter({ text: `You have ${seconds} seconds to answer!` })
      .addFields(
        { name: 'Category', value: '`' + trivia.category + '`', inline: true },
        { name: 'Difficulty', value: '`' + trivia.difficulty + '`', inline: true },
      )

    const components = []
    for (let i = 0; i < trivia.choices.length; i++) {
      const choice = trivia.choices[i]
      components.push(
        new ButtonBuilder().setLabel(choice).setStyle('Primary').setCustomId(`trivia:${i}`)
      )
    }

    const row = new ActionRowBuilder()
      .addComponents(components)

    return interaction.reply({ embeds: [embed], components: [row] }).then(m => {
      const collector = m.createMessageComponentCollector({ time: seconds * 1000 })

      collector.on('collect', async (i) => {
        if (!i.isButton()) return

        await i.deferUpdate()
        if (i.user.id !== interaction.user.id) return i.followUp({ content: `These buttons aren't for you!`, ephemeral: true })

        for (const item of row.components) {
          if (item.data.custom_id === i.customId) {
            item.setStyle('Danger')
          }
          if (item.data.custom_id.split(':')[1] == trivia.answer) {
            item.setStyle('Success')
          }
          item.setDisabled(true)
        }

        return interaction.editReply({ components: [row] })
      })

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          console.log('timeout')
          for (const item of row.components) {
            item.setStyle('Danger')
            if (item.data.custom_id.split(':')[1] == trivia.answer) {
              item.setStyle('Success')
            }
            item.setDisabled(true)
          }
          interaction.editReply({ components: [row] })
        }
      })
    })
  }
};