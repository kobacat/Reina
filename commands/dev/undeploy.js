const { SlashCommand } = require('@squiddleton/discordjs-util');

module.exports = new SlashCommand({
	name: 'undeploy',
	description: 'Removes all application commands from Discord',
	scope: 'Dev',
	async execute(interaction) {
		await interaction.client.application.commands.set([]);
		await interaction.reply({ content: 'All application commands have been removed.', ephemeral: true });
	},
});