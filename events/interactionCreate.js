const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return interaction.reply({ content: `I could not find a command matching ${interaction.commandName}`, ephemeral: true });

			if (command.modOnly && !interaction.member.roles.cache.has('544952148790738954')) return interaction.reply('You are not authorized to use this command.');

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				return interaction.reply('There was an error trying to execute that command!');
			}
		}
	},
};