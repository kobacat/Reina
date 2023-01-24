const Discord = require('discord.js');

const NEXT_WEEKLY = 'January 26 2023 14:00:00';
const NEXT_SEASON = 'March 10 2023 0:00:00';
const NEXT_CREW_PACK = 'February 1 2023 0:00:00';

/**
 *
 * @param {Discord.Client<true>} client
 */
module.exports = async function editServerStatus(client) {
	const botMaintenance = client.channels.cache.get('569954225916739585');
	if (!botMaintenance?.isTextBased()) throw new Error('There\'s a problem with getting bot-maintenance');
	const serverStatus = client.channels.cache.get('946910268548612106');
	if (!serverStatus?.isTextBased()) throw new Error('There\'s a problem with getting server-status');

	const now = new Date();
	const nowMS = now.getTime();

	/**
	 *
	 * @param {number} num
	 */
	function format(num) {
		return ('0' + Math.floor(num)).slice(-2);
	}
	/**
	 *
	 * @param {number} days
	 * @returns {string[]}
	 */
	function getTimes(days) {
		return [
			(days / 60 / 60) % 60, // hours
			(days / 60) % 60, // minutes
			days % 60, // seconds
		].map(newNum => format(newNum));
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
	/**
	 *
	 * @param {string} str
	 * @param {string} [language]
	 */
	const transformTimeString = async function (str, language) {
		const remainingTime = getRemainingTime(str);
		let timeString = `# ${remainingTime.days} Days, ${remainingTime.hours} Hours, ${remainingTime.minutes} Minutes, ${remainingTime.seconds} Seconds`;
		const nums = [remainingTime.days, remainingTime.hours, remainingTime.minutes, remainingTime.seconds];
		if (nums.some(num => num === 0)) {
			await botMaintenance.send('<@92002056784580608> TIMER OUT OF SYNC');
		}
		if (nums.some(num => num < 0)) {
			language = 'bash';
			timeString = '# Temporarily Unavailable';
		}

		return language !== undefined ? Discord.codeBlock(language, timeString) : Discord.codeBlock(timeString);
	};

	// CURRENT TIME
	/*
	const [hours, min, sec] = getTimes(now);
	const TIMENOW = `${hours}:${min}:${sec} UTC`;
	*/

	// SERVER TIME

	const SERVER_TIME = Discord.codeBlock('md', `# ${now.toUTCString()} UTC`);

	// DAILY QUESTS

	const dailyStart = new Date();
	dailyStart.setHours(14, 0, 0, 0); // 2pm utc
	if (now > dailyStart) { // if current time is greater, then add one day
		dailyStart.setDate(dailyStart.getDate() + 1);
	}
	const dailyDays = (dailyStart.getTime() - now.getTime()) / 1000;
	const [dailyHours, dailyMins, dailySecs] = getTimes(dailyDays);
	const DAILY_QUESTS = Discord.codeBlock('glsl', `# ${dailyHours} hours, ${dailyMins} minutes, ${dailySecs} seconds`);

	// WEEKLY QUESTS

	const WEEKLY_QUESTS = await transformTimeString(NEXT_WEEKLY, 'glsl');

	// ITEM SHOP

	const shopStart = new Date();
	shopStart.setHours(0, 0, 0, 0); // 12am utc
	if (now > shopStart) { // if current time is greater, then add one day
		shopStart.setDate(shopStart.getDate() + 1);
	}
	const shopDays = (shopStart.getTime() - now.getTime()) / 1000;
	const [shopHours, shopMins, shopSecs] = getTimes(shopDays);
	const ITEM_SHOP = Discord.codeBlock('fix', `# ${shopHours} hours, ${shopMins} minutes, ${shopSecs} seconds`);

	// CREW PACK

	const CREW_PACK = await transformTimeString(NEXT_CREW_PACK, 'fix');

	// SEASON DOWNTIME

	const SEASON_DOWNTIME = await transformTimeString(NEXT_SEASON);

	// EVENT DOWNTIME
	/*
	const EVENT_DOWNTIME = await transformTimeString(eventdeadline, 'glsl');
	*/

	const statusEmbed = new Discord.EmbedBuilder()
		.setColor('#111111')
		.setTitle('Fortnite Server Status')
		.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
		.addFields(
			{ name: 'Server Time (NA)', value: `**${SERVER_TIME}**` },
			{ name: 'Daily Quests', value: 'Releasing **every day at 9 AM EST | 1 PM UTC**' },
			{ name: 'Time until Daily Quests refresh', value: `**${DAILY_QUESTS}**` },
			{ name: 'Weekly Quests', value: 'Releasing **every Thursday at 9 AM EST | 1 PM UTC**' },
			{ name: 'Time until Weekly Quests refresh', value: `**${WEEKLY_QUESTS}**` },
			{ name: 'Item Shop', value: 'Rotates **every day at 7 PM EST | 12 AM UTC**' },
			{ name: 'Time until Item Shop refreshes', value: `**${ITEM_SHOP}**` },
			{ name: 'Crew Pack', value: 'Rotates **the last day of the month at 7 PM EST | 12 AM UTC**' },
			{ name: 'Time until Crew Pack refresh', value: `**${CREW_PACK}**` },
			{ name: 'Time until Update Downtime', value: 'There is no downtime currently scheduled.' },
			{ name: 'Chapter 4: Season 2', value: 'Starts **March 10th**' },
			{ name: 'Time until Season Downtime', value: `**${SEASON_DOWNTIME}**` },
			{ name: 'Next Event', value: 'There are no events currently scheduled.' },
		)
		.setFooter({ text: 'FortniteBR Discord Server' })
		.setTimestamp();

	await serverStatus.messages.edit('946910268548612106', { embeds: [statusEmbed] });
};