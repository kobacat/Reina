const { SlashCommand } = require('@squiddleton/discordjs-util');
const createStatus = require('../../util/createStatus.js');

module.exports = new SlashCommand({
	name: 'gamestatus',
	description: 'Grabs the Fortnite server status',
	scope: 'Exclusive',
	async execute(interaction, client) {
		const embed = await createStatus(client, false);
		await interaction.reply({ embeds: [embed] });
	},
});