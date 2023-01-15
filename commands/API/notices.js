const { SlashCommand } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');
const { epicFetch } = require('../../API/epicauth.js');

module.exports = new SlashCommand({
	name: 'notices',
	description: 'Lists current Emergency Notices for Fortnite',
	scope: 'Exclusive',
	async execute(interaction) {
		const { client } = interaction;
		const json = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en');
		const notices = json.emergencynoticev2.emergencynotices.emergencynotices;
		if (notices.length == 0) {
			return interaction.reply({ content: 'There are currently no emergency notices.' });
		}
		const embeds = notices.map(entry => {
			return new Discord.EmbedBuilder()
				.setAuthor({ name: 'Reina', iconURL: client.user.displayAvatarURL() })
				.setTitle(`${entry.title}`)
				.setColor('#FF0000')
				.setDescription(entry.body)
				.setImage('https://i.imgur.com/DF7QZbH.png');
		});
		await interaction.reply({ embeds });
	},
});