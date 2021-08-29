import ytdl from 'ytdl-core';

import { COMMAND_PREFIX } from '../constants';
import { PLAYLIST_COLLECTION } from '../model';

const IS_ADD_COMMAND_REGEX = `${COMMAND_PREFIX} add (.*)`;

/**
 * Handles the add command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function add(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;
  const link = isAdd(command);

  if (link === null) return false;

  processAddCommand(messageHook, guildId, link);

  return true;
}

/**
 * Process the command by checking the link, and adding the item to the playlist
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're adding a link for
 * @param {string} link The link to a youtube video
 */
async function processAddCommand(messageHook, guildId, link) {
  if (!(await validateYoutubeLink(messageHook, link))) return;
  if (!(await validateYoutubeVideoAvailable(messageHook, link))) return;

  const playlist = await PLAYLIST_COLLECTION.getPlaylist(guildId);
  playlist.add(link);
}

/**
 * Verifies that the current command is an add command
 *
 * @param {string} command The command being used
 * @returns {boolean} Whether the command is an add command or not
 */
function isAdd(command) {
  const parsedValues = new RegExp(IS_ADD_COMMAND_REGEX).exec(command);
  return parsedValues === null ? null : parsedValues[1];
}

/**
 * Method to validate if the youtube link is valid
 *
 * @param {module:app.Message} responseHook The hook to send a message with if the link is invalid
 * @param {string} link The youtube link to test
 * @returns {boolean} Whether the link is valid or not
 */
async function validateYoutubeLink(responseHook, link) {
  const isLinkValid = await ytdl.validateURL(link);

  if (!isLinkValid) {
    await responseHook.reply("Sorry, we couldn't recognise your link as a valid youtube video!");
  }

  return isLinkValid;
}

/**
 * Method to validate if the youtube video is available in the region we're streaming from
 *
 * @param {module:app.Message} responseHook The hook to respond with if the video is unavailable
 * @param {string} link The youtube link to test
 * @returns {boolean} Whether the video is available to stream or not
 */
async function validateYoutubeVideoAvailable(responseHook, link) {
  const information = await ytdl.getInfo(link);

  const isAvailable = information.formats.length > 0;

  if (!isAvailable) {
    await responseHook.reply(
      "Sorry, could not add your video to the playlist, it doesn't appear to be available in this region!",
    );
  }

  return isAvailable;
}

export default add;
