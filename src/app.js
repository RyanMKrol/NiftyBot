import {
  Client, Collection, Events, GatewayIntentBits,
} from 'discord.js';

import logger from './modules/logger';

import ping from './modules/commands/ping';
import server from './modules/commands/server';
import user from './modules/commands/user';

import DISCORD_CREDENTIALS from './modules/constants';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  logger.debug(`Ready! Logged in as ${c.user.tag}`);
});

client.commands.set(ping.data.name, ping);
client.commands.set(server.data.name, server);
client.commands.set(user.data.name, user);

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

// Log in to Discord with your client's token
client.login(DISCORD_CREDENTIALS.token);
