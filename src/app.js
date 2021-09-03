/** @module app */

import Discord from 'discord.js';

import { DISCORD_CREDENTIALS } from './modules/constants';
import { onGuildCreate, onMessage, onVoiceStateUpdate } from './modules/events';

const client = new Discord.Client();

client.on('guildCreate', onGuildCreate);
client.on('message', onMessage);
client.on('voiceStateUpdate', onVoiceStateUpdate);

client.login(DISCORD_CREDENTIALS.token);

/**
 * Type representing the message object from discord.js
 *
 * @typedef Message
 * @see https://discord.js.org/#/docs/main/stable/class/Message
 */

/**
 * Type representing the voice channel object from discord.js
 *
 * @typedef VoiceChannel
 * @see https://discord.js.org/#/docs/main/stable/class/VoiceChannel
 */
