const fs = require('fs')
const { PermissionsBitField } = require('discord.js')
const { Routes } = require('discord-api-types/v9')
const { REST } = require('@discordjs/rest')
const rest = new REST({
  version: '9'
}).setToken(process.env.token);

module.exports = (client) => {
  const slashCommands = [];
  fs.readdirSync('./slash/').forEach(async dir => {
    const files = fs.readdirSync(`./slash/${dir}/`).filter(file => file.endsWith('.js'))
    
    for (const file of files) {
      const slashCommand = require(`./slash/${dir}/${file}`)
      slashCommands.push({
        name: slashCommand.name,
        description: slashCommand.description,
        type: slashCommand.type,
        options: slashCommand.options ? slashCommand.options : null,
        default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
        default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
      })
      
      if (slashCommand.name) {
        client.slashCommands.set(slashCommand.name, slashCommand)
      } else {
        console.log(slashCommand)
      }
    }
  });
  
  (async () => {
    try {
      await rest.put(
      	Routes.applicationCommands(process.env.client),
      	{ body: slashCommands },
      )
      console.log(`/ commands registered`)
    } catch (error) {
      console.log(error);
    }
  })();
}