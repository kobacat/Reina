const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.content === 'Hi Reina') {
			message.reply('Online');
		}

		if (!message.content.startsWith(process.env.PREFIX)) return;

		// if (command.ownerOnly && user.id !== config.ownerid) return;
	},
};