const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const fs = require('fs')
const client = require('..')

function type(data) {
  return Object.prototype.toString.call(data).slice(8, -1)
}

function isObject(data) {
  return type(data) === 'Object' && Object.getPrototypeOf(data).constructor === Object && Object.getPrototypeOf(data) === Object.prototype
}

function format(data, indent) {
  console.log(type(data))
  if (!indent) indent = 0
  if (type(data) === 'Array') {
    for (let i = 0; i < data.length; i++) {
      data[i] = format(data[i])
    }
    return `${type(data)}(${data.length}): [ ${data.join(', ')} ]`
  } else if (type(data) === 'String') {
    return `"${data}"`
  } else if (isObject(data)) {
    let s = `${(!indent) ? `Object (${Object.keys(data).length}) ` : ''}{\n`
    for (const [k, v] of Object.entries(data)) {
      s += `**    ${' '.repeat(indent * 4)}**${format(k)}: ${(isObject(data)) ? format(v, 1) : format(v)},\n`
    }
    return s += `${' '.repeat(indent * 4)}}`
  } else if (type(data) === 'Map') {
    let s = `${(!indent) ? `Map (${data.size}) ` : ''}{\n`
    for (const [k, v] of data) {
      s += `**    ${' '.repeat(indent * 4)}**${format(k)}: ${(isObject(data) || type(data) === 'Map' || type(data) === 'Object') ? format(v, 1) : format(v)},\n`
    }
    return s += `${' '.repeat(indent * 4)}}`
  } else if (['Function', 'AsyncFunction'].includes(type(data))) {
    data = data.toString()
    const f = data.match(/\([	-~]*/g)[0]
    return `${(data.includes('async')) ? 'Async' : ''}Function: ${f}`
  } else if (['Number', 'Boolean'].includes(type(data))) {
    return data.toString()
  } else if (type(data) === 'Undefined') {
    return 'undefined'
  } else if (type(data) === 'Object') {
    let s = `${(!indent) ? `Object (${Object.keys(data).length}) ` : ''}{\n`
    for (const [k, v] of Object.entries(data)) {
      s += `**    ${' '.repeat(indent * 4)}**${format(k)}: ${(isObject(data)) ? format(v, 1) : format(v)},\n`
    }
    return s += `${' '.repeat(indent * 4)}}`
  } else {
    return `Instance of ${(data.constructor.name) ? data.constructor.name : 'Unknown Class'}: ${format(data.toString())}`
  }
}

function validate({ content, embeds, components }) {
  let o = {}
  if (content && type(content) === 'String') o.content = content
  if (o.content || o.embeds || o.components) return o
  return false
}

module.exports = {
  async respond(interaction) {
    if (interaction.isChatInputCommand()) {
      client.slashCommands.get(interaction.commandName).run(client, interaction)
    } else if (interaction.isButton()) {
      console.log(interaction.customId)
      if (interaction.customId === 'modal:script') {
        const modal = new ModalBuilder()
          .setCustomId(`script:${interaction.user.id}`)
          .setTitle('Code Editor')

        const script = new TextInputBuilder()
          .setCustomId('script')
          .setLabel('JavaScript')
          .setStyle(TextInputStyle.Paragraph)

        const row = new ActionRowBuilder().addComponents(script)

        modal.addComponents(row)
        interaction.showModal(modal)
      }
    } else if (interaction.isModalSubmit()) {
      const input = interaction.fields.getTextInputValue('script')
      let output
      const data = fs.readFileSync('data.fjs', 'utf-8')
      let code = data.split(/\/\/[ ]?\$[ ]*/g)[1]
      // (new Function("eval('')"))() could be a security threat
      try {
        output = (new Function('process', 'interaction', 'client', `${code}; ${input}`))(
          null, 
          {
            reply(obj) {
              const msg = validate(obj)
              if (msg) interaction.reply(msg).catch(e => console.log(e))
              return msg
            },
            channel: {
              send(obj) {
                const msg = validate(obj)
                if (msg) interaction.channel.send(msg).catch(e => console.log(e))
                return msg
              },
            },
            guild: {
              id: interaction.guild.id,
              name: interaction.guild.name,
            },
          }, 
          {
            guilds: {
              cache: {
                size: client.guilds.cache.size,
              },
            },
          },
        )
        output = format(output)
      } catch (e) {
        output = e.stack.split('\n').splice(0, 3).join('\n')
      }
      console.log(output)
      interaction.reply({ content: (output) ? output : 'Your code did not return anything!', ephemeral: true }).catch(e => console.log(e))
    }
  }
}