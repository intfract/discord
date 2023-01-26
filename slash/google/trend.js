const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')
const chatgpt = require('../../openai/chatgpt')
const fetch = require('node-fetch')
require('dotenv').config()

module.exports = {
  name: 'trend',
  description: "Get google trends data!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: 'query',
      description: 'The q search parameter!',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'type',
      description: 'The data type like the default TIMESERIES or GEO_MAP_0!',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction, ...args) => {
    const query = interaction.options.get('query').value
    let type = interaction.options.get('type')
    if (type) {
      type = type.value
    } else {
      type = 'TIMESERIES'
    }
    const seconds = 5

    const embed = new EmbedBuilder()
      .setTitle('Google Trends')
      .setDescription(`Query: ${query}`)
      .setColor('#2f3136')

    return interaction.reply({ content: `Generating your response in ${seconds} seconds!`, embeds: [embed] }).then(m => {
      const collector = m.createMessageComponentCollector({ time: seconds * 1000 })

      const q = query.split(',')[0]
      if (type) {
        type = type.toUpperCase()
        if (type !== 'TIMESERIES') type = 'GEO_MAP_0'
      } else {
        type = 'TIMESERIES'
      }
      const params = {
        engine: 'google_trends',
        q: q,
        data_type: type,
        api_key: process.env.serp,
      }
      fetch(`https://serpapi.com/search?${new URLSearchParams(params)}`).then(res => res.json()).then(json => {
        if (type === 'TIMESERIES') {
          const timeline = json.interest_over_time.timeline_data
          if (!timeline) return
          console.log(timeline)
          const graph = []
          for (let i = 0; i < timeline.length; i++) {
            const period = timeline[i]
            graph.push(period.values[0].extracted_value)
          }
          chatgpt.say(`comment on a time series graph using the following values ${graph.join(', ')}`).then(completion => {
            console.log(completion.data.choices)
            return interaction.editReply({ content: completion.data.choices[0].text })
          })
        } else {
          console.log(json)
          return interaction.editReply({ content: JSON.stringify(json) })
        }
      })

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          console.log('timeout')
        }
      })
    })
  },
}