const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')
const chatgpt = require('../../openai/chatgpt')
const fetch = require('node-fetch')
require('dotenv').config()

function trend(q, type, callback) {
  q = q.split(',')[0]
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
  fetch(`https://serpapi.com/search?${new URLSearchParams(params)}`).then(res => res.json()).then(json => (json.search_metadata) ? callback(json.interest_over_time.timeline_data) : callback(null))
}

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
    const type = interaction.options.get('type').value
    trend('wordle', null, (timeline) => {
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
    })
  }
}