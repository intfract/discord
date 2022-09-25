const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')
const fs = require('fs')
const path = require('path')

const types = [
  'any',
  'subcommand',
  'subgroup',
  'string',
  'integer',
  'boolean',
  'user',
  'channel',
  'role',
  'mentionable',
  'number',
  'attachment'
]

module.exports = {
  name: 'help',
  description: "Get information about the bot!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle(`Help`)
      .setDescription('Click on the buttons to navigate through the help pages!')
      .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
      .setColor('#2f3136')
      .setTimestamp()

    // for (const [k, v] of client.slashCommands) {
    //   let cmd = k
    //   if (v.options) {
    //     for (const option of v.options) {
    //       cmd += ` ${option.name}:${types[option.type]}`
    //     }
    //   }
    //   embed.addFields(
    //     { name: cmd, value: v.description },
    //   )
    // }

    const components = []
    const groups = fs.readdirSync('./slash')
    console.log(groups)
    for (const group of groups) {
      components.push(
        new ButtonBuilder()
          .setLabel(`${group.charAt(0).toUpperCase() + group.substr(1).toLowerCase()}`)
          .setStyle('Primary')
          .setCustomId(`help:${group}`)
      )
    }

    const row = new ActionRowBuilder()
      .addComponents(components)

    return interaction.reply({ embeds: [embed], components: [row] }).then(m => {
      const collector = m.createMessageComponentCollector({ time: 15000 })

      collector.on('collect', async (i) => {
        if (!i.isButton()) return

        await i.deferUpdate()
        if (i.user.id !== interaction.user.id) return i.followUp({ content: `These buttons aren't for you!`, ephemeral: true })

        const title = i.customId.split(':')[1]

        const section = new EmbedBuilder()
          .setTitle(title.charAt(0).toUpperCase() + title.substr(1).toLowerCase())
          .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
          .setColor('#2f3136')
          .setTimestamp()

        const files = fs.readdirSync(`./slash/${title}`).filter(file => file.endsWith('.js'))
        for (const file of files) {
          const command = require(`../${title}/${file}`)
          let cmd = command.name
          if (command.options) {
            for (const option of command.options) {
              cmd += ` ${option.name}:${types[option.type]}`
            }
          }
          section.addFields(
            { name: cmd, value: command.description }
          )
        }

        return m.interaction.editReply({ embeds: [section] })
      })

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          console.log('timeout')
          for (const item of row.components) {
            item.setDisabled(true)
          }
          interaction.editReply({ components: [row] })
        }
      })
    })
  }
};