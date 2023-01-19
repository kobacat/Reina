const { SlashCommand } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');

module.exports = new SlashCommand({
	name: 'pingbutcooler',
	description: 'Fetches API data and reports back.',
	scope: 'Dev',
	async execute(interaction, client) {
		const message = await interaction.reply({ content: 'Fetching', fetchReply: true });

		const botPing = Math.round(message.createdTimestamp - interaction.createdTimestamp);

		let statusEstimate;
		if (botPing <= 50) {
			statusEstimate = 'Great!';
		}
		else if (botPing > 50 && botPing <= 100) {
			statusEstimate = 'Decent!';
		}
		else if (botPing > 100 && botPing <= 150) {
			statusEstimate = 'Okay.';
		}
		else {
			statusEstimate = 'Not the best.';
		}

		const pingEmbed = new Discord.EmbedBuilder()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
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