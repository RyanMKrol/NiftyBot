import {
  Client, Collection, Events, GatewayIntentBits,
} from 'discord.js';

import DISCORD_CREDENTIALS from './modules/constants';
import { logger } from './modules/logger';
import * as COMMANDS from './modules/commands';
import { GUILD_COLLECTION } from './modules/models';

const { getVoiceConnection } = require('@discordjs/voice');

const APP_USER_NAME = 'NiftyBot';

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
client.commands = new Collection();

// Register commands with client
Object.keys(COMMANDS).forEach((key) => {
  const command = COMMANDS[key];
  client.commands.set(command.data.name, command);
});

// Register event handler with client
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.debug(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Register voice channel update event handler with client
client.on(Events.VoiceStateUpdate, async (_, newState) => {
  const guildId = newState.guild.id;
  const connection = getVoiceConnection(guildId);

  if (connection) {
    const channel = client.channels.cache.get(connection.joinConfig.channelId);

    const isBotInChannel = channel.members
      .map((member) => member.user.username)
      .filter((username) => username === APP_USER_NAME)
      .length === 1;

    const areNonBotsInChannel = channel.members
      .filter((member) => member.user.username !== APP_USER_NAME && !member.user.bot)
      .size > 0;

    // if the bot isn't in the channel, but we have a connection, it was
    // likely disconnected manually, so we should cleanup our model of the guild
    if (!isBotInChannel) {
      logger.debug('The bot has been disconnected manually, cleaning up...');

      if (GUILD_COLLECTION.hasGuild(guildId)) {
        GUILD_COLLECTION.removeGuild(guildId);
      }
    }

    // if the non bot members aren't in the channel, we should cleanup our model of
    // the guild, so that we're not wasting compute playing for nobody
    if (!areNonBotsInChannel) {
      logger.debug("All humans have left the bot's channel, disconnecting...");

      if (GUILD_COLLECTION.hasGuild(guildId)) {
        GUILD_COLLECTION.removeGuild(guildId);
      }
    }
  }
});

// Log in to Discord
client.login(DISCORD_CREDENTIALS.token);
