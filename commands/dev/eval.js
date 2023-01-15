const { SlashCommand, evalCommand } = require('@squiddleton/discordjs-util');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = new SlashCommand({
	name: 'eval',
	description: 'Evaluates code',
	options: [
		{
			name: 'code',
			description: 'Code to evaluate',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	scope: 'Dev',
	async execute(interaction) {
		await evalCommand(interaction, interaction.options.getString('code', true), false);
	},
});