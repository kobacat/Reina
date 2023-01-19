const { ClientEvent } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');

module.exports = new ClientEvent({
	name: Events.MessageCreate,
	async execute(message) {
		if (message.content === 'Hi Reina') {
			await message.reply('Online');
		}

		if (!message.content.startsWith(process.env.PREFIX)) return;

		// if (command.ownerOnly && user.id !== config.ownerid) return;
	},
});