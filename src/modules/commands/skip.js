import { COMMAND_PREFIX } from '../constants';
import createGuildManagerInstance from '../model';

const IS_SKIP_COMMAND_REGEX = `${COMMAND_PREFIX} skip`;

/**
 * Handles the skip command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function skip(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  if (!isSkip(command)) return false;

  processSkipCommand(messageHook, guildId);

  return true;
}

/**
 * Process the command by skipping the current song
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're processing the command for
 */
async function processSkipCommand(messageHook, guildId) {
  const manager = await createGuildManagerInstance(guildId);
  manager.next();
}

/**
 * Verifies that the current command is a skip command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a skip command or not
 */
function isSkip(command) {
  const parsedValues = new RegExp(IS_SKIP_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default skip;
