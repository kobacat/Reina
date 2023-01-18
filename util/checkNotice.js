const Discord = require('discord.js');
const { epicFetch } = require('../API/epicauth.js');

/**
 *
 * @param {Discord.Client<true>} client
 */
module.exports = async function checkNotice(client) {
	const json = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en');
	const notices = json.emergencynoticev2.emergencynotices.emergencynotices;

	const embeds = notices.map(entry => {
		return new Discord.EmbedBuilder()
			.setAuthor({ name: 'Reina', iconURL: client.user.displayAvatarURL() })
			.setTitle(`${entry.title}`)
			.setColor('#FF0000')
			.setDescription(entry.body)
			.setImage('https://i.imgur.com/DF7QZbH.png');
	});

	['740559376070475796', '488040333310164992'].forEach(id => client.channels.cache.get(id).send({ embeds }));
};