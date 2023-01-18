const { ClientEvent } = require('@squiddleton/discordjs-util');
const { Events } = require('discord.js');
const { schedule } = require('node-cron');
const { epicFetch } = require('../API/epicauth.js');
const checkStatus = require('../util/checkStatus.js');

module.exports = new ClientEvent({
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`${client.user.tag} is now online!`);

		const maintenanceChannel = client.channels.cache.get('569954225916739585');
		if (maintenanceChannel === undefined || !maintenanceChannel.isTextBased()) throw new Error('There\'s a problem with getting the maintenance channel');

		// Check Fortnite server status
		const STjson = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite');
		let status1 = STjson[0].status;
		schedule('*/1 * * * *', async () => {
			const STjson2 = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite');
			const status2 = STjson2[0].status;
			if (status2 !== status1) {
				await maintenanceChannel.send(`Fortnite server status change detected at ${Date()}, sending updates...`);
				await checkStatus(client);
				status1 = status2;
			}
		});

		// Check Fortnite Emergency Notices
		const ENjson = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en');
		let notice1 = ENjson.emergencynoticev2.emergencynotices.emergencynotices;
		schedule('*/1 * * * *', async () => {
			const ENjson2 = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en');
			const notice2 = ENjson2[0].status;
			const filtered = notice2.filter(n => !notice1.find(old => old.title === n.title));
			if (!filtered.length) return;
			await maintenanceChannel.send(`Emergency notice detected at ${Date()}, sending updates...`);
			await maintenanceChannel.send(`Fortnite server status change detected at ${Date()}, sending updates...`);
			await checkStatus(client);
			notice1 = notice2.emergencynoticev2.emergencynotices.emergencynotices;
		});
	},
});