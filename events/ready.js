const { ClientEvent } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');
const { schedule } = require('node-cron');
const { epicFetch } = require('../API/epicauth.js');
const createNotices = require('../util/createNotices.js');
const createStatus = require('../util/createStatus.js');
const editServerStatus = require('../util/editServerStatus.js');

module.exports = new ClientEvent({
	name: Discord.Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`${client.user.tag} is now online!`);

		schedule('*/10 * * * *', async () => {
			await editServerStatus(client);
		});

		const botMainteance = client.channels.cache.get('569954225916739585');
		if (!botMainteance?.isTextBased()) throw new Error('There\'s a problem with getting bot-maintenance');
		const general = client.channels.cache.get('569954225916739585');
		if (!general?.isTextBased()) throw new Error('There\'s a problem with getting general');
		const statusAnnouncements = client.channels.cache.get('740559376070475796');
		if (!statusAnnouncements?.isTextBased()) throw new Error('There\'s a problem with getting status-announcements');

		const channels = [general, statusAnnouncements];

		let status1 = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite')
			.then(json => json[0].status);

		let oldNotices = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en')
			.then(website => website.emergencynoticev2.emergencynotices.emergencynotices);

		schedule('*/1 * * * *', async () => {
			// Check Fortnite server status
			const status2 = await epicFetch('https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite')
				.then(json => json[0].status);

			if (status2 !== status1) {
				await botMainteance.send(`Fortnite server status change detected at ${Date()}, sending updates...`);
				const statusEmbed = await createStatus(client, true);
				for (const channel of channels) {
					await channel.send({ embeds: [statusEmbed] });
				}
				status1 = status2;
			}

			// Check Fortnite Emergency Notices
			const newNotices = await epicFetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=en')
				.then(website => website.emergencynoticev2.emergencynotices.emergencynotices);
			const filtered = newNotices.filter(n => !oldNotices.find(old => old.title === n.title));

			if (filtered.length > 0) {
				await botMainteance.send(`Emergency notice detected at ${Date()}, sending updates...`);
				const noticeEmbeds = await createNotices(client, filtered);
				for (const channel of channels) {
					await channel.send({ embeds: noticeEmbeds });
				}
				oldNotices = newNotices;
			}
		});
	},
});