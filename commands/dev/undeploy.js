const { SlashCommand } = require('@squiddleton/discordjs-util');

module.exports = new SlashCommand({
	name: 'undeploy',
	description: 'Remove all application commands from Discord',
	scope: 'Dev',
	async execute(interaction) {
		interaction.client.application.fetch().then(a => a.commands.set([]));
	},
});