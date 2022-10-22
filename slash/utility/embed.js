const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'embed',
  description: "Create and send an embed with dynamic values!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: 'title',
      description: 'The title of the embed!',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'description',
      description: 'The description of the embed!',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'color',
      description: 'The hex color code of the embed!',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'author',
      description: 'name|icon|url',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'footer',
      description: 'name|icon',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'fields',
      description: 'name=value|name=value',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'image',
      description: 'The image URL!',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const user = interaction.user;
    const guild = client.guilds.cache.get(interaction.guild.id)
    const author = guild.members.cache.get(user.id)
    let color = interaction.options.get('color')
    let hex = '#2f3136'
    if (color && /^#([0-9A-F]{3}){1,2}$/i.test(color.value)) hex = color.value
    
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.options.get('title').value}`)
      .setDescription(`${interaction.options.get('description').value}`)
      .setColor(hex)

    function append(x) {
      const i = interaction.options.get(x.toLowerCase())
      let v;
      console.log(i)
      if (i) {
        if (x === 'Image') {
          v = i.value
        } else {
          y = i.value.split('|')
          console.log(y)
          if (['Author', 'Footer'].includes(x)) {
            v = {}
            v.name = y[0]
            v.iconURL = y[1]
            v.url = y[2]
            // check empty strings and invalid URLs
          } else {
            v = []
            for (let s of y) {
              z = s.split('=')
              if (s.includes('=') 
                  && z[0].length > 0 
                  && z[1].length > 0) {
                v.push({ name: z[0], value: z[1] })
              }
            }
          }
        }
      } else {
        return false
      }
      console.log(v)
      if (Array.isArray(v)) {
        try {
          embed[`set${x}`](...v)
        } catch (e) {
          console.log(e)
        }
      } else {
        try {
          embed[`set${x}`](v)
        } catch (e) {
          console.log(e)
        }
      }
    }

    append('Author')
    append('Footer')
    append('Fields')
    append('Image')

    return interaction.reply({ embeds: [embed] }).catch(e => console.log(e))
  }
}