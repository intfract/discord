const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const fs = require('fs')
const client = require('..')
const fract = require('../fract')

function type(data) {
  return Object.prototype.toString.call(data).slice(8, -1)
}

function isObject(data) {
  return type(data) === 'Object' && Object.getPrototypeOf(data).constructor === Object && Object.getPrototypeOf(data) === Object.prototype
}

function format(data, indent) {
  if (!indent) indent = 0
  if (type(data) === 'Array') {
    for (let i = 0; i < data.length; i++) {
      data[i] = format(data[i])
    }
    return `${type(data)}(${data.length}): [ ${data.join(', ')} ]`
  } else if (type(data) === 'String') {
    return `"${data}"`
  } else if (isObject(data)) {
    let s = `${(!indent) ? `Object(${Object.keys(data).length}): ` : ''}{\n`
    for (const [k, v] of Object.entries(data)) {
      s += `**    ${' '.repeat(indent * 4)}**${k}: ${(isObject(data)) ? format(v, 1) : format(v)},\n`
    }
    return s += `${' '.repeat(indent * 4)}}`
  } else if (['Function', 'AsyncFunction'].includes(type(data))) {
    data = data.toString()
    const f = data.match(/\([	-~]*/g)[0]
    return `${(data.includes('async')) ? 'Async' : ''}Function: ${f}`
  } else if (type(data) === 'Number') {
    return data
  } else if (type(data) === 'Undefined') {
    return 'undefined'
  } else {
    return `Instance of ${(data.constructor.name) ? data.constructor.name : 'Unknown Class'}: ${data}`
  }
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
      let ouput
      const data = fs.readFileSync('data.fjs', 'utf-8')
      let code = fract(data.split(/\/\/[ ]?\$[ ]*/g)[1], interaction)
      // (new Function("eval('')"))() could be a security threat
      try {
        const exe = (new Function(`${code}; ${input}`))
        result = exe()
        console.log(result)
        output = format(result)
      } catch (e) {
        output = e.stack.split('\n').splice(0, 3).join('\n')
      }
      await interaction.reply({ content: (output) ? output : 'Your code did not return anything!', ephemeral: true })
    }
  }
}