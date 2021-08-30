import { COMMAND_PREFIX } from '../constants';
import GUILD_MANAGER_COLLECTION from '../model';

const IS_CLEAR_COMMAND_REGEX = `${COMMAND_PREFIX} clear`;

/**
 * Handles the clear command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function clear(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  if (!isClear(command)) return false;

  processClearCommand(messageHook, guildId);

  return true;
}

/**
 * Process the command by clearing the playlist
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're processing the command for
 */
async function processClearCommand(messageHook, guildId) {
  const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
  manager.clearPlaylist();
}

/**
 * Verifies that the current command is a clear command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a clear command or not
 */
function isClear(command) {
  const parsedValues = new RegExp(IS_CLEAR_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default clear;
