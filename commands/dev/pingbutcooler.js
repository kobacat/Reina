const { SlashCommand } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');

module.exports = new SlashCommand({
	name: 'pingbutcooler',
	description: 'Fetches API data and reports back.',
	scope: 'Dev',
	async execute(interaction) {
		const { client } = interaction;

		interaction.reply({ content: 'Fetching', fetchReply: true }).then(msg => {
			const botLatency = msg.createdTimestamp - interaction.createdTimestamp;
			const provLatency = msg.createdTimestamp - interaction.createdTimestamp;

			const botPing = Math.round(provLatency);
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
				.setColor('54BAE3')
				.setDescription(`Pong! Outlook performance is ${statusEstimate}`)
				.addFields({ name: 'Bot Latency', value: `${Math.round(botLatency)} milliseconds`, inline: true })
				.addFields({ name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)} milliseconds`, inline: true });

			interaction.editReply({ content: null,
				embeds: [pingEmbed],
			});
		});
	},
});