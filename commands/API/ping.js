const { SlashCommand } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');

module.exports = new SlashCommand({
	modOnly: true,
	name: 'ping',
	description: 'Fetches API data and reports back.',
	scope: 'Exclusive',
	async execute(interaction) {
		const { client } = interaction;

		const message = await interaction.reply({ content: 'Fetching', fetchReply: true });
		const botLatency = message.createdTimestamp - interaction.createdTimestamp;

		const botPing = Math.round(botLatency);
		let statusEstimate;

		if (botPing <= 50) {
			statusEstimate = 'Great!';
		}
		else if (botPing > 50 && botPing < 100) {
			statusEstimate = 'Decent!';
		}
		else if (botPing > 100 && botPing < 150) {
			statusEstimate = 'Okay.';
		}
		else {
			statusEstimate = 'Not the best.';
		}

		const pingEmbed = new Discord.EmbedBuilder()
			.setAuthor({ name: 'Reina', iconURL: client.user.displayAvatarURL() })
			.setColor('#54BAE3')
			.setDescription(`Pong! Outlook performance is ${statusEstimate}`)
			.addFields({ name: 'Bot Latency', value: `${botPing} milliseconds`, inline: true })
			.addFields({ name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)} milliseconds`, inline: true });

		interaction.editReply({
			content: null,
			embeds: [pingEmbed],
		});
	},
});