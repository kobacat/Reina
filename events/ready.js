const { Events } = require('discord.js');
const { schedule } = require('node-cron');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`${client.user.tag} is now online!`);
		client.deploy();

		const checkStatus = require('./../util/checkStatus.js');

		// Check Fortnite server status
		const { epicFetch } = require('../epicauth.js');
		const json = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite');
		let status1 = json[0].status;
		schedule('*/1 * * * *', async () => {
			const json2 = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite');
			const status2 = json2[0].status;
			if (status2 !== status1) {
				client.channels.cache.get('569954225916739585').send(`Fortnite server status change detected at ${Date()}, sending updates...`);
				await checkStatus(client);
				return status1 = status2;
			}
		}, { timezone: 'Etc/UTC' });
	},
};