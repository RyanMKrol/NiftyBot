import ytdl from 'ytdl-core';
import ytpl from 'ytpl';

import { COMMAND_PREFIX } from '../constants';
import GUILD_MANAGER_COLLECTION from '../model';

const IS_ADD_COMMAND_REGEX = `^${COMMAND_PREFIX}add (.*)`;

/**
 * Handles the add command
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @returns {boolean} Whether this was the command to run or not
 */
async function add(messageHook) {
  const command = messageHook.content;
  const guildId = messageHook.channel.guild.id;
  const channelId = messageHook.member.voice.channelID;
  const channel = messageHook.member.voice.guild.channels.cache.get(channelId);

  const link = isAdd(command);

  if (link === null) return false;

  processAddCommand(messageHook, guildId, channel, link);

  return true;
}

/**
 * Process the command by checking the link, and adding the item to the playlist
 *
 * @param {module:app.Message} messageHook The hook that contains the command being used
 * @param {string} guildId The guild that we're adding a link for
 * @param {string} channel The channel to play in
 * @param {string} link The link to a youtube video
 */
async function processAddCommand(messageHook, guildId, channel, link) {
  if (!(await validateUserState(messageHook))) return;
  if (!(await validateYoutubeLink(messageHook, link))) return;

  const videoInfo = await validateYoutubeVideoAvailable(messageHook, link);
  if (videoInfo === null) return;

  const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
  ytpl(link)
    .then((playlist) => {
      processPlaylist(manager, playlist);
      manager.ensurePlaying(channel);
      manager.listSongs(messageHook);
    })
    .catch(() => {
      processSong(manager, link, videoInfo);
      manager.ensurePlaying(channel);
      manager.listSongs(messageHook);
    });
}

/**
 * Adds a single song to our playlist
 *
 * @param {GuildManager} manager Facade to playlist and player objects
 * @param {string} link The link to the media to play
 * @param {JSON} videoInfo Object containing information about the song
 */
async function processSong(manager, link, videoInfo) {
  const playlistItem = {
    link,
    title: videoInfo.videoDetails.title,
  };

  manager.addToPlaylist(playlistItem);
}

/**
 * Add a playlist of songs to our playlist
 *
 * @param {GuildManager} manager Facade to playlist and player objects
 * @param {JSON} playlistInfo Data around a playlist
 */
async function processPlaylist(manager, playlistInfo) {
  const playlistItems = playlistInfo.items.map((item) => ({
    link: item.shortUrl,
    title: item.title,
  }));

  manager.addMultipleToPlaylist(playlistItems);
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

  return isAvailable ? information : null;
}

/**
 * Method to validate if user adding a playlist item is in the voice channel
 *
 * @param {module:app.Message} responseHook The hook to send a message with if the user is
 * not in a valid state
 * @returns {boolean} Whether the user is in a voice channel
 */
async function validateUserState(responseHook) {
  const isUserInVoiceChannel = responseHook.member.voice.channelID !== null;

  if (!isUserInVoiceChannel) {
    await responseHook.reply("You're not in a voice channel!");
  }

  return isUserInVoiceChannel;
}

export default add;
