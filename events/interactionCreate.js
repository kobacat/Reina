const { ClientEvent } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');

module.exports = new ClientEvent({
	name: Discord.Events.InteractionCreate,
	async execute(interaction) {
		const { client } = interaction;
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return interaction.reply({ content: `I could not find a command matching ${interaction.commandName}`, ephemeral: true });

			if (command.modOnly && interaction.inCachedGuild() && !interaction.member.roles.cache.has('544952148790738954')) return interaction.reply('You are not authorized to use this command.');

			try {
				await command.execute(interaction, client);
			}
			catch (error) {
				console.error(error);
				return interaction.reply('There was an error trying to execute that command!');
			}
		}
	},
});