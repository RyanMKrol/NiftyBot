import { COMMAND_PREFIX } from '../constants';
import { PLAYLIST_COLLECTION } from '../model';

const IS_REMOVE_COMMAND_REGEX = `${COMMAND_PREFIX} remove (.*)`;

/**
 * Handles the list command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function remove(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  const removeIndex = isRemove(command);

  if (removeIndex === null) return false;

  processRemoveCommand(messageHook, guildId, removeIndex);

  return true;
}

/**
 * Process the command by listing the current playlist items
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're listing the playlist for
 * @param removeIndex
 */
async function processRemoveCommand(messageHook, guildId, removeIndex) {
  const playlist = await PLAYLIST_COLLECTION.getPlaylist(guildId);
  playlist.remove(removeIndex);
}

/**
 * Verifies that the current command is an add command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is an add command or not
 */
function isRemove(command) {
  const parsedValues = new RegExp(IS_REMOVE_COMMAND_REGEX).exec(command);
  return parsedValues === null ? null : parsedValues[1];
}

export default remove;
