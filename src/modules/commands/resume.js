import { COMMAND_PREFIX } from '../constants';
import GUILD_MANAGER_COLLECTION from '../model';

const IS_RESUME_COMMAND_REGEX = `${COMMAND_PREFIX} resume`;

/**
 * Handles the resume command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function resume(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  if (!isResume(command)) return false;

  processResumeCommand(messageHook, guildId);

  return true;
}

/**
 * Process the command by resuming the player
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're processing the command for
 */
async function processResumeCommand(messageHook, guildId) {
  const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
  manager.resume();
}

/**
 * Verifies that the current command is a resume command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a resume command or not
 */
function isResume(command) {
  const parsedValues = new RegExp(IS_RESUME_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default resume;
