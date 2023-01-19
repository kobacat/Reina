const Discord = require('discord.js');

const weeklydeadline = 'January 19 2023 14:00:00';
const downtimedeadline = 'March 29 2022 9:00:00';
const seasondeadline = 'March 10 2023 9:00:00';
// const eventdeadline = 'June 4 2022 9:00:00';
const crewpack = 'February 1 2023 0:00:00';

/**
 *
 * @param {Discord.Client<true>} client
 */
module.exports = async function editServerStatus(client) {
	const botMaintenance = client.channels.cache.get('569954225916739585');
	if (!botMaintenance?.isTextBased()) throw new Error('There\'s a problem with getting the maintenance channel');
	const serverStatus = client.channels.cache.get('946910268548612106');
	if (!serverStatus?.isTextBased()) throw new Error('There\'s a problem with getting the server status channel');

	const now = new Date();
	const nowMS = now.getTime();

	/**
	 *
	 * @param {number} num
	 */
	function format(num) {
		return ('0' + Math.floor(num)).substring(-2);
	}
	/**
	 *
	 * @param {string} endTime
	 */
	function getRemainingTime(endTime) {
		const total = Date.parse(endTime) - nowMS;
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
		const days = Math.floor(total / (1000 * 60 * 60 * 24));

		return {
			seconds,
			minutes,
			hours,
			days,
		};
	}

	// CURRENT TIME
	/*
	const hours = format((now / 60 / 60) % 60);
	const min = format((now / 60) % 60);
	const sec = format(now % 60);
	const TIMENOW = `${hours}:${min}:${sec} UTC`;
	*/

	// DAILY QUESTS

	const startdaily = new Date();
	startdaily.setHours(14, 0, 0); // 2pm utc
	if (now > startdaily) { // if current time is greater, then add one day
		startdaily.setDate(startdaily.getDate() + 1);
	}
	const daysdaily = ((startdaily - now) / 1000);
	const hoursdaily = format((daysdaily / 60 / 60) % 60);
	const mindaily = format((daysdaily / 60) % 60);
	const secdaily = format(daysdaily % 60);
	const DAILYQUESTS = Discord.codeBlock('glsl', `# ${hoursdaily} hours, ${mindaily} minutes, ${secdaily} seconds`);

	// ITEM SHOP

	const startshop = new Date();
	startshop.setHours(0, 0, 0); // 12am utc
	if (now > startshop) { // if current time is greater, then add one day
		startshop.setDate(startshop.getDate() + 1);
	}
	const daysshop = ((startshop - now) / 1000);
	const hoursshop = format((daysshop / 60 / 60) % 60);
	const minshop = format((daysshop / 60) % 60);
	const secshop = format(daysshop % 60);
	const ITEMSHOP = Discord.codeBlock('fix', `# ${hoursshop} hours, ${minshop} minutes, ${secshop} seconds`);

	// WEEKLY CHALLENGES

	let WEEKLYQUESTS = Discord.codeBlock('glsl', `# ${getRemainingTime(weeklydeadline).days} Days, ${getRemainingTime(weeklydeadline).hours} Hours, ${getRemainingTime(weeklydeadline).minutes} Minutes, ${getRemainingTime(weeklydeadline).seconds} Seconds`);
	if ((getRemainingTime(weeklydeadline).days === 0) && (getRemainingTime(weeklydeadline).hours === 0) && (getRemainingTime(weeklydeadline).minutes === 0) && (getRemainingTime(weeklydeadline).seconds === 0)) {
		await botMaintenance.send('<@92002056784580608> WEEKLY QUEST TIMER OUT OF SYNC');
	}
	if (getRemainingTime(weeklydeadline).days < 0 || getRemainingTime(weeklydeadline).hours < 0 || getRemainingTime(weeklydeadline).minutes < 0 || getRemainingTime(weeklydeadline).seconds < 0) {
		WEEKLYQUESTS = Discord.codeBlock('bash', '# Temporarily Unavailable');
	}

	// VERSION UPDATE

	let DOWNTIME = Discord.codeBlock(`# ${getRemainingTime(downtimedeadline).days} Days, ${getRemainingTime(downtimedeadline).hours} Hours, ${getRemainingTime(downtimedeadline).minutes} Minutes, ${getRemainingTime(downtimedeadline).seconds} Seconds`);
	if ((getRemainingTime(downtimedeadline).days === 0) && (getRemainingTime(downtimedeadline).hours === 0) && (getRemainingTime(downtimedeadline).minutes === 0) && (getRemainingTime(downtimedeadline).seconds === 0)) {
		await botMaintenance.send('<@92002056784580608> DOWNTIME TIMER OUT OF SYNC');
	}
	if (getRemainingTime(downtimedeadline).days < 0 || getRemainingTime(downtimedeadline).hours < 0 || getRemainingTime(downtimedeadline).minutes < 0 || getRemainingTime(downtimedeadline).seconds < 0) {
		DOWNTIME = Discord.codeBlock('bash', '# Temporarily Unavailable');
	}

	// SEASON DOWNTIME

	let SEASONDOWNTIME = Discord.codeBlock(`# ${getRemainingTime(seasondeadline).days} Days, ${getRemainingTime(seasondeadline).hours} Hours, ${getRemainingTime(seasondeadline).minutes} Minutes, ${getRemainingTime(seasondeadline).seconds} Seconds`);
	if ((getRemainingTime(seasondeadline).days === 0) && (getRemainingTime(seasondeadline).hours === 0) && (getRemainingTime(seasondeadline).minutes === 0) && (getRemainingTime(seasondeadline).seconds === 0)) {
		await botMaintenance.send('<@92002056784580608> SEASON TIMER OUT OF SYNC');
	}
	if (getRemainingTime(seasondeadline).days < 0 || getRemainingTime(seasondeadline).hours < 0 || getRemainingTime(seasondeadline).minutes < 0 || getRemainingTime(seasondeadline).seconds < 0) {
		SEASONDOWNTIME = Discord.codeBlock('bash', '# Temporarily Unavailable');
	}

	// EVENT DOWNTIME
	/*
	let EVENTLAUNCH = Discord.codeBlock('glsl', `# ${getRemainingTime(eventdeadline).days} Days, ${getRemainingTime(eventdeadline).hours} Hours, ${getRemainingTime(eventdeadline).minutes} Minutes, ${getRemainingTime(eventdeadline).seconds} Seconds`);
	if ((getRemainingTime(eventdeadline).days === 0) && (getRemainingTime(eventdeadline).hours === 0) && (getRemainingTime(eventdeadline).minutes === 0) && (getRemainingTime(eventdeadline).seconds === 0)) {
		await botMaintenance.send('<@92002056784580608> EVENT TIMER OUT OF SYNC');
	}
	if (getRemainingTime(eventdeadline).days < 0 || getRemainingTime(eventdeadline).hours < 0 || getRemainingTime(eventdeadline).minutes < 0 || getRemainingTime(eventdeadline).seconds < 0) {
		EVENTLAUNCH = Discord.codeBlock('bash', '# Temporarily Unavailable');
	}
	*/

	// CREW PACK

	let CREWPACKLAUNCH = Discord.codeBlock('fix', `# ${getRemainingTime(crewpack).days} Days, ${getRemainingTime(crewpack).hours} Hours, ${getRemainingTime(crewpack).minutes} Minutes, ${getRemainingTime(crewpack).seconds} Seconds`);
	if ((getRemainingTime(crewpack).days === 0) && (getRemainingTime(crewpack).hours === 0) && (getRemainingTime(crewpack).minutes === 0) && (getRemainingTime(crewpack).seconds === 0)) {
		await botMaintenance.send('<@92002056784580608> CREW PACK TIMER OUT OF SYNC');
	}
	if (getRemainingTime(crewpack).days < 0 || getRemainingTime(crewpack).hours < 0 || getRemainingTime(crewpack).minutes < 0 || getRemainingTime(crewpack).seconds < 0) {
		CREWPACKLAUNCH = Discord.codeBlock('bash', '# Temporarily Unavailable');
	}

	// SERVER TIME

	const servertime = Discord.codeBlock('md', `# ${now.toUTCString()} UTC`);

	const statusEmbed = new Discord.EmbedBuilder()
		.setColor('#111111')
		.setTitle('Fortnite Server Status')
		.setAuthor({ name: 'Reina', iconURL: client.user.displayAvatarURL() })
		.addFields(
			{ name: 'Server Time (NA)', value: `**${servertime}**`, inline: false },
			{ name: 'Daily Quests', value: 'Releasing **every day at 8 AM EST | 1 PM UTC**', inline: false },
			{ name: 'Time until Daily Quests refresh', value: `**${DAILYQUESTS}**`, inline: false },
			{ name: 'Weekly Quests', value: 'Releasing **every Thursday at 8 AM EST | 1 PM UTC**', inline: false },
			{ name: 'Time until Weekly Quests refresh', value: `**${WEEKLYQUESTS}**`, inline: false },
			{ name: 'Item Shop', value: 'Rotates **every day at 8 PM EST | 12 AM UTC**', inline: false },
			{ name: 'Time until Item Shop refreshes', value: `**${ITEMSHOP}**`, inline: false },
			{ name: 'Crew Pack', value: 'Rotates **the last day of the month at 8 PM EST | 12 AM UTC**', inline: false },
			{ name: 'Time until Crew Pack refresh', value: `**${CREWPACKLAUNCH}**`, inline: false },
			{ name: 'Next Major Update | v20.10', value: 'Launches **every other Tuesday at 3 AM EST | 7 AM UTC**', inline: false },
			{ name: 'Time until Update Downtime', value: `**${DOWNTIME}**`, inline: false },
			{ name: 'Chapter 3: Season 3', value: 'Starts **June 4th at 9 AM EST | 1 PM UTC**', inline: false },
			{ name: 'Time until Season Downtime', value: `**${SEASONDOWNTIME}**`, inline: false },
			{ name: 'Next Event', value: 'There are no events currently scheduled.', inline: false },
			// ONLY ENABLE WHEN THERE'S AN EVENT
			// { name: 'Time until Season Downtime', value: `# **${SEASONDOWNTIME}**`, inline: false },
		)
		.setFooter({ text: 'FortniteBR Discord Server' })
		.setTimestamp();

	await serverStatus.messages.edit('946910268548612106', { embeds: [statusEmbed] });
};