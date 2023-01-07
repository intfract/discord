const client = require('..')
const fs = require('fs');

module.exports = {
  respond(reaction, user) {
    const file = fs.readFileSync('reactions.discord', 'utf-8')
    const lines = file.split('\n')
    lines.shift()
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      x = line.split('=')
      const id = x[0]
      if (id === reaction.message.id) {
        const roles = x[1].split('|')[0].split(',')
        const emojis = x[1].split('|')[1].split(',')
        const role = roles[emojis.indexOf((reaction.emoji.id) ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` : reaction.emoji.name)]
        const guild = client.guilds.cache.get(reaction.message.guildId)
        const member = guild.members.cache.get(user.id)
        member.roles.add(role.match(/[0-9]+/g)).catch(e => console.log(e))
        return
      }
    }
  }
}