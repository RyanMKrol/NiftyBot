import {
  Client, Collection, Events, GatewayIntentBits,
} from 'discord.js';

import DISCORD_CREDENTIALS from './modules/constants';
import logger from './modules/logger';
import * as COMMANDS from './modules/commands';

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

// Log in to Discord
client.login(DISCORD_CREDENTIALS.token);
