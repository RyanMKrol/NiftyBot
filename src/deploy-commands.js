import { REST, Routes } from 'discord.js';

import DISCORD_CREDENTIALS from './modules/constants';

import logger from './modules/logger';
import ping from './modules/commands/ping';
import server from './modules/commands/server';
import user from './modules/commands/user';

const commands = [];

commands.push(ping.data.toJSON());
commands.push(server.data.toJSON());
commands.push(user.data.toJSON());

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
