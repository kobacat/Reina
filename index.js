const fs = require('fs');
const { Client, ClientEvent } = require('@squiddleton/discordjs-util');
const Discord = require('discord.js');
require('dotenv/config');

const commands = [];
for (const folder of fs.readdirSync('./commands')) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		commands.push(command);
	}
}

/** @type {ClientEvent[]} */
const events = [];
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event instanceof ClientEvent) events.push(event);
	else throw new Error(`The event file ${file} does not export a ClientEvent instance`);
}

const client = new Client({
	commands,
	devGuildId: process.env.devGuild,
	events,
	exclusiveGuildId: process.env.FNBRGuild,
	failIfNotExists: false,
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
	],
	presence: {
		activities: [{
			name: 'the Zero Point',
			type: Discord.ActivityType.Watching,
		}],
	},
});

client.login(process.env.TOKEN);