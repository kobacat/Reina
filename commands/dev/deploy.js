const { SlashCommand } = require('@squiddleton/discordjs-util');

module.exports = new SlashCommand({
	name: 'deploy',
	description: 'Deploys all application commands to Discord',
	scope: 'Dev',
	async execute(interaction, client) {
		await client.deploy();
		await interaction.reply({ content: 'All application commands have been deployed.', ephemeral: true });
	},
});