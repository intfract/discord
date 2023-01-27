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
  run: async (client, interaction, ...args) => {
    const embed = new EmbedBuilder()
      .setTitle(`Help`)
      .setDescription('Click on the buttons to navigate through the help pages!')
      .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
      .setColor('#2f3136')
      .setTimestamp()

    const components = []
    const groups = fs.readdirSync('./slash')
    console.log(groups)
    if (args[0]) {
      components.push(
        new ButtonBuilder()
          .setLabel('Linear')
          .setStyle('Primary')
          .setCustomId('help:linear'),
        new ButtonBuilder()
          .setLabel('ChatGPT')
          .setStyle('Primary')
          .setCustomId('help:chatgpt'),
        new ButtonBuilder()
          .setLabel('Scripting')
          .setStyle('Success')
          .setCustomId('help:scripting'),
      )
    } else {
      for (const group of groups) {
        components.push(
          new ButtonBuilder()
            .setLabel(`${group.charAt(0).toUpperCase() + group.substr(1).toLowerCase()}`)
            .setStyle('Primary')
            .setCustomId(`help:${group}`)
        )
      }
    }

    const row = new ActionRowBuilder()
      .addComponents(components)

    return interaction.reply({ embeds: [embed], components: [row] }).then(message => {
      const collector = message.createMessageComponentCollector({ time: 15000 })

      collector.on('collect', async (i) => {
        if (!i.isButton()) return

        await i.deferUpdate()
        if (args[0]) {
          if (i.user.id !== interaction.author.id) return i.followUp({ content: `These buttons aren't for you!`, ephemeral: true })
        } else {
          if (i.user.id !== interaction.user.id) return i.followUp({ content: `These buttons aren't for you!`, ephemeral: true })
        }

        const title = i.customId.split(':')[1]

        const section = new EmbedBuilder()
          .setTitle(title.charAt(0).toUpperCase() + title.substr(1).toLowerCase())
          .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
          .setColor('#2f3136')
          .setTimestamp()

        if (args[0]) {
          if (title === 'scripting') {
            section
              .setDescription(`This bot can execute JavaScript code and access some information from the discord framework.`)
              .addFields(
                { name: 'Execution', value: 'The bot will reply with the value of the `return` statement!' },
                { name: 'Methods', value: 'The bot can execute interaction methods like `interaction.channel.send`!' },
                { name: 'Builders', value: 'The bot can send embeds. See https://discord.js.org/#/docs/builders/main/class/EmbedBuilder for more information!' },
              )
          } else if (title === 'linear') {
            const files = fs.readdirSync(`./linear`).filter(file => file.endsWith('.js'))
            for (const file of files) {
              const command = require(`../../linear/${file}`)
              let cmd = command.name
              if (command.options) {
                for (const option of command.options) {
                  if (option.required) {
                    cmd += ` ${option.name}:${types[option.type]}`
                  } else {
                    cmd += ` [${option.name}:${types[option.type]}]`
                  }
                }
              }
              section.addFields(
                { name: cmd, value: command.description }
              )
            }
          } else if (title === 'chatgpt') {
            section
              .setDescription(`This bot can interact with Open AI services and give intelligent responses.`)
              .addFields(
                { name: 'ChatGPT', value: 'The bot can relay your prompt to ChatGPT and return a response!' },
                { name: 'Code', value: 'It is recommended that you ask ChatGPT to style its answer with markdown!' },
              )
          }
          return message.edit({ embeds: [section] })
        } else {
          const files = fs.readdirSync(`./slash/${title}`).filter(file => file.endsWith('.js'))
          for (const file of files) {
            const command = require(`../${title}/${file}`)
            let cmd = command.name
            if (command.options) {
              for (const option of command.options) {
                if (option.required) {
                  cmd += ` ${option.name}:${types[option.type]}`
                } else {
                  cmd += ` [${option.name}:${types[option.type]}]`
                }
              }
            }
            section.addFields(
              { name: cmd, value: command.description }
            )
          }
          console.log((new EmbedBuilder()).data)
          return message.interaction.editReply({ embeds: [section] })
        }
      })

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          console.log('timeout')
          for (const item of row.components) {
            item.setDisabled(true)
          }
          ((args[0]) ? message.edit({ components: [row] }) : interaction.editReply({ components: [row] }))
        }
      })
    })
  }
}