const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'profile',
  description: "Display a user's information!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: 'user',
      description: 'The user you want information from!',
      type: ApplicationCommandOptionType.User,
      required: false,
    }
  ],
  run: async (client, interaction) => {
    const user = interaction.options.get('user')?.user || interaction.user;
    const guild = client.guilds.cache.get(interaction.guild.id)
    const member = guild.members.cache.get(user.id)

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 4096 }))
      .setColor('#2f3136')
      .setTimestamp()
      .addFields(
        { name: 'ID', value: `${user.id}` },
        { name: 'Bot', value: `${user.bot}` },
      )

    if (member.roles.cache.size > 1) {
      embed.addFields({
        name: 'Roles',
        value: member.roles.cache
          .map(r => `<@&${r.id}>`)
          .slice(0, -1)
          .join(' ')
      })
    }

    return interaction.reply({ embeds: [embed] })
  }
}