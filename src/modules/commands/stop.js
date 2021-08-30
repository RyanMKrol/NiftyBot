import { COMMAND_PREFIX } from '../constants';
import createGuildManagerInstance from '../model';

const IS_STOP_COMMAND_REGEX = `${COMMAND_PREFIX} stop`;

/**
 * Handles the stop command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function stop(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  if (!isStop(command)) return false;

  processStopCommand(messageHook, guildId);

  return true;
}

/**
 * Process the command by stopping the player
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're processing the command for
 */
async function processStopCommand(messageHook, guildId) {
  const manager = await createGuildManagerInstance(guildId);
  manager.stop();
}

/**
 * Verifies that the current command is a stop command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a stop command or not
 */
function isStop(command) {
  const parsedValues = new RegExp(IS_STOP_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default stop;
