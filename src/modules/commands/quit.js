import { COMMAND_PREFIX } from '../constants';
import GUILD_MANAGER_COLLECTION from '../model';

const IS_QUIT_COMMAND_REGEX = `${COMMAND_PREFIX} quit`;

/**
 * Handles the quit command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function quit(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  if (!isQuit(command)) return false;

  processQuitCommand(messageHook, guildId);

  return true;
}

/**
 * Process the command by quitting the player
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're processing the command for
 */
async function processQuitCommand(messageHook, guildId) {
  const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
  manager.quit();
}

/**
 * Verifies that the current command is a quit command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a quit command or not
 */
function isQuit(command) {
  const parsedValues = new RegExp(IS_QUIT_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default quit;
