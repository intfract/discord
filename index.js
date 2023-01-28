const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require('discord.js')
require('dotenv').config()
const fs = require('fs')

const server = require('./server')
const events = require('./events')
const deploy = require('./deploy')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

client.commands = new Collection()
client.slashCommands = new Collection()

const commands = fs.readdirSync('./linear', file => file.endsWith('.js'))
for (const command of commands) {
  const file = require(`./linear/${command}`)
  client.commands.set(file.name, file)
}

client.prefix = 'dev ';

module.exports = client;

deploy(client)
events(client)

client.login(process.env.token)