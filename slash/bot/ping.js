const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'ping',
	description: "Check the bot's ping!",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({ content: `🏓 Pong! Latency: **${Math.round(client.ws.ping)} ms**` })
	}
};