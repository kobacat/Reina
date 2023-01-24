const Discord = require('discord.js');
const { epicFetch } = require('../API/epicauth.js');

/**
 *
 * @param {Discord.Client<true>} client
 * @param {boolean} automatic
 */
module.exports = async function createStatus(client, automatic) {
	const json = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite');
	const { message, status } = json[0];

	const isUp = status === 'UP';

	const statusEmbed = new Discord.EmbedBuilder()
		.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTitle(`${automatic ? '**Server Status change deteceted**: ' : ''}Fortnite servers are currently **${isUp ? 'online' : 'offline'}**`)
		.setColor(isUp ? '#56B849' : '#D62128')
		.setDescription(`Status message: "**${message}**"`)
		.setImage(isUp ? 'https://i.imgur.com/TWicoNT.png' : 'https://i.imgur.com/2wCFxey.png');

	return statusEmbed;
};