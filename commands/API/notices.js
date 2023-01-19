const { SlashCommand } = require('@squiddleton/discordjs-util');
const { epicFetch } = require('../../API/epicauth.js');
const createNotices = require('../../util/createNotices.js');

module.exports = new SlashCommand({
	name: 'notices',
	description: 'Lists current Emergency Notices for Fortnite',
	scope: 'Exclusive',
	async execute(interaction, client) {
		const json = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en');
		const notices = json.emergencynoticev2.emergencynotices.emergencynotices;
		if (notices.length == 0) {
			await interaction.reply('There are currently no emergency notices.');
			return;
		}
		const noticeEmbeds = await createNotices(client, notices);
		await interaction.reply({ embeds: noticeEmbeds });
	},
});