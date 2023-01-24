const { SlashCommand, evalCommand } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');

module.exports = new SlashCommand({
	name: 'eval',
	description: 'Evaluates code',
	options: [
		{
			name: 'code',
			description: 'Code to evaluate',
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
		},
	],
	scope: 'Dev',
	async execute(interaction) {
		await evalCommand(interaction, interaction.options.getString('code', true), false);
	},
});