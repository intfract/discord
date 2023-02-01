const client = require('..')
const fs = require('fs')
require('dotenv').config()
const fetch = require('node-fetch')

module.exports = {
  async respond(reaction, user) {
    if (user.bot) return

    const response = await fetch(`https://crudapi.co.uk/api/v1/reaction_roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.crud}`
      },
    })

    const data = await response.json()
    console.log(data)

    for (let i = 0; i < data.items.length; i++) {
      if (reaction.message.id === data.items[i].id) {
        const { roles, emojis } = data.items[i]
        console.log(roles, emojis)
        const role = roles[emojis.indexOf((reaction.emoji.id) ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` : reaction.emoji.name)]
        if (!role) return
        const guild = client.guilds.cache.get(reaction.message.guildId)
        const member = guild.members.cache.get(user.id)
        member.roles.remove(role.id).catch(e => console.log(e))
        return
      }
    }
  }
}