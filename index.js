const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require('discord.js')

require('http').createServer((req, res) => res.end(process.version)).listen()
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
client.aliases = new Collection()
client.slashCommands = new Collection()

client.prefix = '&';

module.exports = client;

deploy(client)
events(client)

client.login(process.env.token)