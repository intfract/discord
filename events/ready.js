const { ActivityType } = require('discord.js')

module.exports = {
  respond(client) {
    const activities = [
  		{ name: `${client.guilds.cache.size} Server${(client.guilds.cache.size === 1) ? '' : 's'}`, type: ActivityType.Listening },
  		{ name: `/help`, type: ActivityType.Playing },
  		{ name: `${client.users.cache.size} User${(client.users.cache.size === 1) ? '' : 's'}`, type: ActivityType.Watching },
  		{ name: `Discord.js`, type: ActivityType.Competing }
  	];
  	const status = [
  		'online',
  		'dnd',
  		'idle'
  	];
  	let i = 0;
  	setInterval(() => {
  		if (i >= activities.length) i = 0
  		client.user.setActivity(activities[i])
  		i++
  	}, 5000)
    client.user.setStatus('online')
  	console.log(`Logged in as ${client.user.tag}!`)
  }
}