const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, messageLink } = require('discord.js');
const fs = require('fs')

module.exports = {
  name: 'reactroles',
  description: "Send a message with reaction roles!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: 'message',
      description: 'The content of the message!',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'role-a',
      description: 'The first role!',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: 'emoji-a',
      description: 'The first emoji!',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'role-b',
      description: 'Another role!',
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: 'emoji-b',
      description: 'Another emoji!',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'role-c',
      description: 'Another role!',
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: 'emoji-c',
      description: 'Another emoji!',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'role-d',
      description: 'Another role!',
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: 'emoji-d',
      description: 'Another emoji!',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const user = interaction.user;
    const guild = client.guilds.cache.get(interaction.guild.id)
    const author = guild.members.cache.get(user.id)

    const content = interaction.options.get('message').value
    const roles = []
    const emojis = []

    for (let i = 1; i < interaction.options._hoistedOptions.length; i += 2) {
      const role = interaction.options._hoistedOptions[i]
      roles.push(role.role)
      const emoji = interaction.options._hoistedOptions[i + 1]
      emojis.push(emoji.value)
    }

    const file = fs.readFileSync('reactions.discord', 'utf-8')
    fs.writeFileSync('reactions.discord', '')

    const message = await interaction.reply({ content: content, fetchReply: true })
    for (const emoji of emojis) {
      message.react(emoji).catch(e => console.log(e))
    }

    function filter(reaction, user) {
      return emojis.includes(`<:${reaction.emoji.name}:${reaction.emoji.id}>`)
    }

    const collector = message.createReactionCollector({ filter, time: 20000 })
    collector.on('collect', (reaction, user) => {
      // needs security
      // console.log(reaction)
      // const emoji = `<:${reaction.emoji.name}:${reaction.emoji.id}>`
      // const role = roles[emojis.indexOf(emoji)]
      // const member = guild.members.cache.get(user.id)
      // console.log(member)
      // member.roles.add(role)
    })
    collector.on('end', (collected) => {
      console.log(collected.size)
    })
  }
}