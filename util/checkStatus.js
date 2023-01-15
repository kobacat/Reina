const Discord = require('discord.js');

module.exports = async function checkStatus(client) {
	const { epicFetch } = require('../API/epicauth.js');
	const json = epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite');
	const { status } = json[0];

	const statusEmbed = new Discord.EmbedBuilder()
		.setAuthor({ name: 'Reina', iconURL: client.user.displayAvatarURL() })
		.setTitle(status === 'UP' ? '**Server Status change deteceted**: Fortnite servers are currently **online**' :
			'**Server Status change deteceted**: Fortnite servers are **offline**')
		.setColor(status === 'UP' ? '#56B849' : '#D62128')
		.setDescription(`Status message: "**${json[0].message}**"`)
		.setImage(status === 'UP' ? 'https://i.imgur.com/TWicoNT.png' : 'https://i.imgur.com/2wCFxey.png');

	['740559376070475796', '488040333310164992'].forEach(id => client.channels.cache.get(id).send({ embeds: [statusEmbed] }));
};