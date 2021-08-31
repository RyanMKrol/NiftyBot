import { COMMAND_PREFIX, HELP_DATA } from '../constants';

const IS_HELP_COMMAND_REGEX = `^${COMMAND_PREFIX}help`;

/**
 * Handles the help command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function help(messageHook) {
  const command = messageHook.content;

  if (!isHelp(command)) return false;

  processHelpCommand(messageHook);

  return true;
}

/**
 * Process the command by helpping the current song
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 */
async function processHelpCommand(messageHook) {
  messageHook.reply(HELP_DATA);
}

/**
 * Verifies that the current command is a help command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a help command or not
 */
function isHelp(command) {
  const parsedValues = new RegExp(IS_HELP_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default help;
