import Discord from 'discord.js';

import { DISCORD_CREDENTIALS } from './modules/constants';

const client = new Discord.Client();

client.login(DISCORD_CREDENTIALS.token);
