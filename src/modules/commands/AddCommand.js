/* eslint-disable class-methods-use-this */

import ytdl from 'ytdl-core';
import ytpl from 'ytpl';

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * AddCommand
 */
export class AddCommand extends BaseCommand {
  /**
   * Constructor
   */
  constructor() {
    const patterns = [
      {
        pattern: `^${COMMAND_PREFIX}add (.*)`,
        display: `${COMMAND_PREFIX}add <youtube_link>`,
      },
      {
        pattern: `^${COMMAND_PREFIX}play (.*)`,
        display: `${COMMAND_PREFIX}play <youtube_link>`,
      },
    ];
    super(patterns);
  }

  /**
   * Process the add command
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {string} link The link to the content to play
   */
  async process(messageHook, link) {
    const guildId = messageHook.channel.guild.id;
    const channelId = messageHook.member.voice.channelID;
    const channel = messageHook.member.voice.guild.channels.cache.get(channelId);

    const videoInfo = await validateYoutubeVideoAvailable(messageHook, link);

    if (!(await validateUserState(messageHook))) return;
    if (!(await validateYoutubeLink(messageHook, link))) return;
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
   * Verifies that the current command is an add command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const patterns = this.getPatterns();

    for (let i = 0; i < patterns.length; i += 1) {
      const parsedValues = new RegExp(patterns[i]).exec(command);
      if (parsedValues !== null) {
        return [parsedValues[1]];
      }
    }

    return null;
  }
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

const ADD = new AddCommand();

export default ADD;
