const fs = require('fs');
const path = require('path');
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

const client = new Client({
	commands,
	devGuildId: process.env.devGuild,
	events: fs.readdirSync('./events').filter(file => file.endsWith('.js')).map(file => {
		const event = require(`./events/${file}`);
		if (event instanceof ClientEvent) return event;
		else throw new Error(`The event file ${file} does not export a ClientEvent instance`);
	}),
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

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);