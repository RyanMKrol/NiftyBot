import Discord from 'discord.js';

import { DISCORD_CREDENTIALS } from './modules/constants';
import { onGuildCreate, onMessage } from './modules/events';

const client = new Discord.Client();

client.on('guildCreate', onGuildCreate);
client.on('message', onMessage);

client.login(DISCORD_CREDENTIALS.token);
