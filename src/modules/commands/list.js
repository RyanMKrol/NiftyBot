import { COMMAND_PREFIX } from '../constants';
import { PLAYLIST_COLLECTION } from '../model';

const IS_LIST_COMMAND_REGEX = `${COMMAND_PREFIX} list`;

/**
 * Handles the list command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function list(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;

  if (!isList(command)) return false;

  processListCommand(messageHook, guildId);

  return true;
}

/**
 * Process the command by listing the current playlist items
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're listing the playlist for
 */
async function processListCommand(messageHook, guildId) {
  const playlist = await PLAYLIST_COLLECTION.getPlaylist(guildId);
  messageHook.reply(`Here's the current playlist: ${playlist.get()}`);
}

/**
 * Verifies that the current command is a list command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is a list command or not
 */
function isList(command) {
  const parsedValues = new RegExp(IS_LIST_COMMAND_REGEX).exec(command);
  return parsedValues !== null;
}

export default list;
