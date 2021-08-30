import { COMMAND_PREFIX } from '../constants';
import GUILD_MANAGER_COLLECTION from '../model';

const IS_PAUSE_COMMAND_REGEX = `${COMMAND_PREFIX} pause`;

/**
 * Handles the pause command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function pause(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  if (!isPause(command)) return false;

  processPauseCommand(messageHook, guildId);

  return true;
}

/**
 * Process the command by pausing the player
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're processing the command for
 */
async function processPauseCommand(messageHook, guildId) {
  const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
  manager.pause();
}

/**
 * Verifies that the current command is a pause command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a pause command or not
 */
function isPause(command) {
  const parsedValues = new RegExp(IS_PAUSE_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default pause;
