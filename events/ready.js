const { ActivityType } = require('discord.js')

module.exports = {
  respond(client) {
    const activities = [
  		{ name: `${client.guilds.cache.size} Servers`, type: ActivityType.Listening },
  		{ name: `/help`, type: ActivityType.Playing },
  		{ name: `${client.users.cache.size} Users`, type: ActivityType.Watching },
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