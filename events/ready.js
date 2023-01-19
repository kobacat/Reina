const { ClientEvent } = require('@squiddleton/discordjs-util');
const { Events } = require('discord.js');
const { schedule } = require('node-cron');
const { epicFetch } = require('../API/epicauth.js');
const checkNotice = require('../util/checkNotice.js');
const createStatus = require('../util/createStatus.js');
const editServerStatus = require('../util/editServerStatus.js');

module.exports = new ClientEvent({
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`${client.user.tag} is now online!`);

		schedule('*/10 * * * *', async () => {
			await editServerStatus(client);
		});

		const maintenanceChannel = client.channels.cache.get('569954225916739585');
		if (maintenanceChannel === undefined || !maintenanceChannel.isTextBased()) throw new Error('There\'s a problem with getting the maintenance channel');

		let status1 = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite')
			.then(json => json[0].status);

		let oldNotices = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en')
			.then(website => website.emergencynoticev2.emergencynotices.emergencynotices);

		schedule('*/1 * * * *', async () => {
			// Check Fortnite server status
			const status2 = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite')
				.then(json => json[0].status);

			if (status2 !== status1) {
				await maintenanceChannel.send(`Fortnite server status change detected at ${Date()}, sending updates...`);
				const statusEmbed = await createStatus(client, true);
				for (const id of ['740559376070475796', '488040333310164992']) {
					await client.channels.cache.get(id).send({ embeds: [statusEmbed] });
				}
				status1 = status2;
			}

			// Check Fortnite Emergency Notices
			const newNotices = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en')
				.then(website => website.emergencynoticev2.emergencynotices.emergencynotices);
			const filtered = newNotices.filter(n => !oldNotices.find(old => old.title === n.title));

			if (filtered.length > 0) {
				await maintenanceChannel.send(`Emergency notice detected at ${Date()}, sending updates...`);
				await checkNotice(client, filtered);
				oldNotices = newNotices;
			}
		});
	},
});