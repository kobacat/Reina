const Discord = require('discord.js');

/**
 *
 * @param {Discord.Client<true>} client
 * @param {any[]} filteredNotices
 */
module.exports = async function checkNotice(client, filteredNotices) {
	const embeds = filteredNotices.map(notice => new Discord.EmbedBuilder()
		.setAuthor({ name: 'Reina', iconURL: client.user.displayAvatarURL() })
		.setTitle(`${notice.title}`)
		.setColor('#FF0000')
		.setDescription(notice.body)
		.setImage('https://i.imgur.com/DF7QZbH.png'),
	);

	['740559376070475796', '488040333310164992'].forEach(id => client.channels.cache.get(id).send({ embeds }));
};