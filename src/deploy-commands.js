import { REST, Routes } from 'discord.js';

import DISCORD_CREDENTIALS from './modules/constants';

import { logger } from './modules/logger';
import * as COMMANDS from './modules/commands';

const commands = [];

Object.keys(COMMANDS).forEach((key) => {
  const command = COMMANDS[key];
  commands.push(command.data.toJSON());
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(DISCORD_CREDENTIALS.token);

// and deploy your commands!
(async () => {
  try {
    logger.debug(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(DISCORD_CREDENTIALS.clientId),
      { body: commands },
    );

    logger.debug(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    logger.error(error);
  }
})();
