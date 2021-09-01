import { COMMAND_MANAGER } from '../model';

/**
 * Method to handle when the bot is added to a server
 *
 * @param {module:app.Guild} guild The guild that the bot has been added to
 */
async function onGuildCreate(guild) {
  const commandsOutput = COMMAND_MANAGER.getHelpData();
  guild.channels.cache
    .find((t) => t.name === 'general')
    .send(
      `Thanks for inviting my bot to your server!\nHere are the commands:\`\`\`yaml\n${commandsOutput}\`\`\`\n`,
    );
}

export default onGuildCreate;
