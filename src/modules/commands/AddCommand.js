/* eslint-disable class-methods-use-this */

import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import ytsr from 'ytsr';
import isUrl from 'is-url';

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

const PROCESSING_PATTERN_MAPPING = {
  GENERIC: `^${COMMAND_PREFIX}play (.*)`,
  VIDEO_SEARCH: `^${COMMAND_PREFIX}search -video (.*)`,
  PLAYLIST_SEARCH: `^${COMMAND_PREFIX}search -playlist (.*)`,
};

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
        pattern: PROCESSING_PATTERN_MAPPING.GENERIC,
        display: `${COMMAND_PREFIX}play <youtube link or video to search for>`,
      },
      {
        pattern: PROCESSING_PATTERN_MAPPING.VIDEO_SEARCH,
        display: `${COMMAND_PREFIX}search -video <text to search for>`,
      },
      {
        pattern: PROCESSING_PATTERN_MAPPING.PLAYLIST_SEARCH,
        display: `${COMMAND_PREFIX}search -playlist <text to search for>`,
      },
    ];

    super(patterns);
  }

  /**
   * Process the add command
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {string} processingType The type of processing to use
   * @param {string} input The user input
   */
  async process(messageHook, processingType, input) {
    const channelId = messageHook.member.voice.channelID;
    const channel = messageHook.member.voice.guild.channels.cache.get(channelId);

    switch (processingType) {
      case PROCESSING_PATTERN_MAPPING.VIDEO_SEARCH:
        this.processVideoSearchCommand(messageHook, channel, input);
        break;
      case PROCESSING_PATTERN_MAPPING.PLAYLIST_SEARCH:
        this.processPlaylistSearchCommand(messageHook, channel, input);
        break;
      default:
        this.processGenericCommand(messageHook, channel, input);
        break;
    }
  }

  /**
   * Process the add command by searching for a video
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {module:app.VoiceChannel}channel The voice channel to play across
   * @param {string} searchTerm The user input
   */
  async processVideoSearchCommand(messageHook, channel, searchTerm) {
    const filters = await ytsr.getFilters(searchTerm);
    const searchResult = await ytsr(filters.get('Type').get('Video').url, {
      limit: 1,
    });

    const link = searchResult.items[0].url;

    this.processVideoLink(messageHook, channel, link);
  }

  /**
   * Process the add command by searching for a playlist
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {module:app.VoiceChannel}channel The voice channel to play across
   * @param {string} searchTerm The user input
   */
  async processPlaylistSearchCommand(messageHook, channel, searchTerm) {
    const filters = await ytsr.getFilters(searchTerm);
    const searchResult = await ytsr(filters.get('Type').get('Playlist').url, {
      limit: 1,
    });

    const link = searchResult.items[0].url;

    this.processVideoLink(messageHook, channel, link);
  }

  /**
   * Process the add command by using either a link or a video search
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {module:app.VoiceChannel}channel The voice channel to play across
   * @param {string} searchTerm The user input
   */
  async processGenericCommand(messageHook, channel, searchTerm) {
    if (isUrl(searchTerm)) {
      this.processVideoLink(messageHook, channel, searchTerm);
    } else {
      this.processVideoSearchCommand(messageHook, channel, searchTerm);
    }
  }

  /**
   * Play the content behind the link
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {module:app.VoiceChannel}channel The voice channel to play across
   * @param {string} link The link for the video to play
   */
  async processVideoLink(messageHook, channel, link) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    if (await ytpl.validateID(link)) {
      const playlist = await ytpl(link);
      processPlaylist(manager, playlist);
      manager.ensurePlaying(channel);
      manager.listSongs(messageHook);
    } else if (await ytdl.validateURL(link)) {
      const videoInfo = await validateYoutubeVideoAvailable(messageHook, link);
      if (!(await validateUserState(messageHook))) return;
      if (!(await validateYoutubeLink(messageHook, link))) return;
      if (videoInfo === null) return;

      processSong(manager, link, videoInfo);
      manager.ensurePlaying(channel);
      manager.listSongs(messageHook);
    } else {
      await messageHook.reply('Failed to recognise your input as a playlist or a video');
    }
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
        return [patterns[i], parsedValues[1]];
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
