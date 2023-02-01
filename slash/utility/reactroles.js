const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, messageLink, PermissionFlagsBits } = require('discord.js')
const fs = require('fs')
require('dotenv').config()
const fetch = require('node-fetch')

module.exports = {
  name: 'reactroles',
  description: "Send a message with reaction roles!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  default_member_permissions: PermissionFlagsBits.AddReactions,
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

    const options = interaction.options._hoistedOptions
    
    for (let i = 1; i < options.length; i += 2) {
      if (options[i] && options[i + 1] && options[i].name.startsWith('role') && options[i + 1].name.startsWith('emoji')) {
        const role = options[i]
        roles.push(role.role)
        const emoji = options[i + 1]
        emojis.push(emoji.value)
      } else {
        i--
      }
    }

    const message = await interaction.reply({ content: content, fetchReply: true })
    for (const emoji of emojis) {
      message.react(emoji).catch(e => console.log(e))
    }

    const json = JSON.stringify([{ 'id': message.id, roles, emojis }])
    const response = await fetch(`https://crudapi.co.uk/api/v1/reaction_roles`, {
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.crud}`
      },
    })

    const data = await response.json()
    console.log(data)
  }
}