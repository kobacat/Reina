const Discord = require('discord.js');

/**
 *
 * @param {Discord.Client<true>} client
 * @param {any[]} notices
 */
module.exports = async function createNotices(client, notices) {
	const embeds = notices.map(notice => new Discord.EmbedBuilder()
		.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTitle(notice.title)
		.setColor('#FF0000')
		.setDescription(notice.body)
		.setImage('https://i.imgur.com/DF7QZbH.png'),
	);
	return embeds;
};