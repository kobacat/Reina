const { ContextMenu, evalCommand } = require('@squiddleton/discordjs-util');
const { ApplicationCommandType } = require('discord.js');

module.exports = new ContextMenu({
	name: 'Eval',
	type: ApplicationCommandType.Message,
	scope: 'Dev',
	async execute(interaction) {
		await evalCommand(interaction, interaction.targetMessage.content, true);
	},
});