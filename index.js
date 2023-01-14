const { Client } = require('@squiddleton/discordjs-util');
const fs = require('fs');
const path = require('path');
require('dotenv/config');
const Discord = require('discord.js');
const { ActivityType } = require('discord.js');

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
	exclusiveGuildId: process.env.FNBRGuild,
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
	],
	presence: {
		activities: [{
			name: 'the Zero Point',
			type: ActivityType.Watching,
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