const { SlashCommand } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');

module.exports = new SlashCommand({
	name: 'gamestatus',
	description: 'Grabs the Fortnite server status',
	scope: 'Exclusive',
	async execute(interaction) {
		const { client } = interaction;
		const { epicFetch } = require('../../API/epicauth.js');
		const json = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite');
		const { status } = json[0];

		const pingEmbed = new Discord.EmbedBuilder()
			.setAuthor({ name: 'Reina', iconURL: client.user.displayAvatarURL() })
			.setTitle(status === 'UP' ? 'Fortnite servers are currently online' : 'Fortnite servers are **offline**')
			.setColor(status === 'UP' ? '#56B849' : '#D62128')
			.setDescription(`Status message: "**${json[0].message}**"`)
			.setImage(status === 'UP' ? 'https://i.imgur.com/TWicoNT.png' : 'https://i.imgur.com/2wCFxey.png');

		interaction.reply({ content: null,
			embeds: [pingEmbed],
		});
	},
});