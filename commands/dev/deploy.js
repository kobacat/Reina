const { SlashCommand } = require('@squiddleton/discordjs-util');

module.exports = new SlashCommand({
	name: 'deploy',
	description: 'Deploy all application commands to Discord',
	scope: 'Dev',
	async execute(interaction) {
		interaction.client.deploy();
	},
});