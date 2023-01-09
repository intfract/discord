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
        question: 'When was minecraft fully released?',
        choices: [
          '2009',
          '2010',
          '2011',
          '2012',
        ],
        answer: 2,
        category: 'Games',
        difficulty: 'Medium',
      },
      {
        question: 'Who took control of minecraft after Notch?',
        choices: [
          'Jens Bergensten',
          'Nathan Adams',
          'Markus Persson',
          'Lydia Winters',
        ],
        answer: 0,
        category: 'Games',
        difficulty: 'Medium',
      },
      {
        question: 'Which mob teleports in minecraft?',
        choices: [
          'Phantoms',
          'Endermites',
          'Ghasts',
          'Shulkers',
        ],
        answer: 3,
        category: 'Games',
        difficulty: 'Easy',
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
        category: 'Computers',
        difficulty: 'Medium',
      },
      {
        question: 'Who was the first person in space?',
        choices: [
          'Edwin Aldrin',
          'Yuri Gagarin',
          'Neil Armstrong',
          'Elon Musk',
        ],
        answer: 1,
        category: 'History',
        difficulty: 'Medium',
      },
      {
        question: 'What is Voldemort\'s real name in Harry Potter?',
        choices: [
          'Severus Snape',
          'Viktor Krum',
          'Tom Riddle',
          'Igor Karakoff',
        ],
        answer: 2,
        category: 'Books',
        difficulty: 'Easy',
      },
      {
        question: 'Who betrayed James and Lily Potter?',
        choices: [
          'Sirius Black',
          'Voldemort',
          'Peter Pettigrew',
          'Lucius Malfoy',
        ],
        answer: 2,
        category: 'Books',
        difficulty: 'Hard',
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
      .setFooter({ text: `You have ${seconds} ${(seconds === 1) ? 'second' : 'seconds'} to answer!` })
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
    
    let answered = false

    const row = new ActionRowBuilder()
      .addComponents(components)

    return interaction.reply({ embeds: [embed], components: [row] }).then(m => {
      const collector = m.createMessageComponentCollector({ time: seconds * 1000 })

      collector.on('collect', async (i) => {
        if (!i.isButton()) return

        await i.deferUpdate()
        if (i.user.id !== interaction.user.id) return i.followUp({ content: `These buttons aren't for you!`, ephemeral: true })

        answered = true

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
            if (!answered) {
              item.setStyle('Danger')
              if (item.data.custom_id.split(':')[1] == trivia.answer) {
                item.setStyle('Success')
              }
            }
            item.setDisabled(true)
          }
          interaction.editReply({ components: [row] })
        }
      })
    })
  }
}