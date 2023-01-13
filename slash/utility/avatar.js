const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'avatar',
  description: "Display a user's avatar!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: 'user',
      description: 'The avatar of the user you want to display!',
      type: ApplicationCommandOptionType.User,
      required: false,
    }
  ],
  run: async (client, interaction, ...args) => {
    const guild = client.guilds.cache.get(interaction.guild.id)
    let user
    if (args[0]) {
      const member = guild.members.cache.get(args[0].substring(2, args[0].length - 1))
      if (member) {
        user = member.user
      } else {
        interaction.reply({ content: 'That user does not exist!' })
        return
      }
    } else {
      user = interaction.options.get('user')?.user || interaction.user
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 4096 }))
      .setColor('#2f3136')
      .setTimestamp()

    const formats = ['png', 'jpg', 'jpeg', 'gif']
    const components = []
    if (!user.avatar) return interaction.reply({ content: `${user.username} does not have an avatar!` })
    formats.forEach(format => {
      let imageOptions = { extension: format, forceStatic: format == 'gif' ? false : true }

      if (user.avatar == null && format !== 'png') return
      if (!user.avatar.startsWith('a_') && format === 'gif') return
      components.push(
        new ButtonBuilder()
          .setLabel(format.toUpperCase())
          .setStyle('Link')
          .setURL(user.displayAvatarURL(imageOptions))
      )
    })

    const row = new ActionRowBuilder()
      .addComponents(components)

    return interaction.reply({ embeds: [embed], components: [row] }).catch(e => console.log(e))
  }
}