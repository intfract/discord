const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, messageLink } = require('discord.js');
const fs = require('fs')

module.exports = {
  name: 'reactembed',
  description: "Send a message with reaction roles and an embed!",
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
    if (color) {
      if (/^([0-9A-F]{6}){1,2}$/i.test(color.value)) {
        hex = '#' + color.value
      } else if (/^#([0-9A-F]{6}){1,2}$/i.test(color.value)) {
        hex = color.value
      }
    }
    
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
            if (y[1] && /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/i.test(y[1])) {
              v.iconURL = y[1]
            }
            if (y[2] && /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(y[2])) {
              v.url = y[2]
            }
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

    const content = interaction.options.get('message').value
    const roles = []
    const emojis = []

    const options = interaction.options._hoistedOptions
    
    for (let i = 3; i < options.length && options[i].name.includes('-'); i += 2) {
      if (options[i] && options[i + 1] && options[i].name.startsWith('role') && options[i + 1].name.startsWith('emoji')) {
        const role = options[i]
        roles.push(role.role)
        const emoji = options[i + 1]
        emojis.push(emoji.value)
      } else {
        i--
      }
    }

    const message = await interaction.reply({ content: content, embeds: [embed], fetchReply: true })
    for (const emoji of emojis) {
      message.react(emoji).catch(e => console.log(e))
    }

    const file = fs.readFileSync('reactions.discord', 'utf-8')
    fs.writeFileSync('reactions.discord', file + `\n${message.id}=${roles}|${emojis}`)
  }
}