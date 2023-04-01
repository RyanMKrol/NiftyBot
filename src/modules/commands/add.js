import { SlashCommandBuilder, BaseInteraction } from 'discord.js';
import ytpl from 'ytpl';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';

import { GUILD_COLLECTION, Guild } from '../models';
import { logger } from '../logger';

const SUBCOMMAND_OPTION_LINK = 'link';
const SUBCOMMAND_OPTION_TITLE = 'title';

const ADD_COMMAND_NAMES = {
  VIDEO: 'video',
  PLAYLIST: 'playlist',
  SEARCH_VIDEO: 'search_video',
  SEARCH_PLAYLIST: 'search_playlist',
};

export default {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add to the playlist')
    .addSubcommand((subcommand) => subcommand
      .setName(ADD_COMMAND_NAMES.VIDEO)
      .setDescription('Add a YouTube video to the playlist')
      .addStringOption((option) => option.setName(SUBCOMMAND_OPTION_LINK)
        .setDescription('A link to a YouTube video')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName(ADD_COMMAND_NAMES.PLAYLIST)
      .setDescription('Add a YouTube playlist to the playlist')
      .addStringOption((option) => option.setName(SUBCOMMAND_OPTION_LINK)
        .setDescription('A link to a YouTube playlist')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName(ADD_COMMAND_NAMES.SEARCH_VIDEO)
      .setDescription('Search for a YouTube video to the playlist')
      .addStringOption((option) => option.setName(SUBCOMMAND_OPTION_TITLE)
        .setDescription('The title of a YouTube video')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName(ADD_COMMAND_NAMES.SEARCH_PLAYLIST)
      .setDescription('Search for a YouTube playlist to the playlist')
      .addStringOption((option) => option.setName(SUBCOMMAND_OPTION_TITLE)
        .setDescription('The title of a YouTube playlist')
        .setRequired(true))),

  /**
   * Executes the command
   *
   * @param {BaseInteraction} interaction User interaction object
   */
  async execute(interaction) {
    const { channel } = interaction.member.voice;

    if (channel === null) {
      interaction.reply('You have to be in a voice channel to add something!');
      return;
    }

    // the next bit of processing may take time, and discord demands a response within 3s,
    // deferReply, extends that window for us by displaying something to the user before we
    // actually reply
    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case ADD_COMMAND_NAMES.VIDEO:
        await processVideoLink(
          interaction,
          interaction.options.getString(SUBCOMMAND_OPTION_LINK),
        );
        break;
      case ADD_COMMAND_NAMES.PLAYLIST:
        await processPlaylistLink(
          interaction,
          interaction.options.getString(SUBCOMMAND_OPTION_LINK),
        );
        break;
      case ADD_COMMAND_NAMES.SEARCH_VIDEO:
        await processVideoSearch(
          interaction,
          interaction.options.getString(SUBCOMMAND_OPTION_TITLE),
        );
        break;
      case ADD_COMMAND_NAMES.SEARCH_PLAYLIST:
        await processPlaylistSearch(
          interaction,
          interaction.options.getString(SUBCOMMAND_OPTION_TITLE),
        );
        break;
      default:
        await interaction.editReply('Failed this miserably!');
        break;
    }
  },
};

/**
 * Method for adding a video to our playlist
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {string} link The link to add to the playlist
 */
async function processVideoLink(interaction, link) {
  logger.debug('Processing a video link...');

  const video = await parseYouTubeVideoLink(interaction, link);

  if (video) {
    logger.debug('Adding video to playlist...');

    const managedGuild = setupGuildFromInteraction(interaction);
    const managedPlaylist = managedGuild.getPlaylist();

    managedPlaylist.add({
      link,
      title: video.videoDetails.title,
    });

    await managedGuild.ensurePlaying();

    await interaction.followUp('Video added!');
  }
}

/**
 * Method for adding a playlist of videos to our playlist
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {string} link The link to unpack videos from, to add to our playlist
 */
async function processPlaylistLink(interaction, link) {
  logger.debug('Processing a playlist link...');

  const playlist = await parseYouTubePlaylistLink(interaction, link);

  if (playlist) {
    logger.debug('Adding videos to playlist...');

    // we don't need to filter by valid youtube links here because the ytpl library
    // pulls out private and unavailable videos for you!
    const playlistItems = playlist.items.map((item) => ({
      link: item.shortUrl,
      title: item.title,
    }));

    const managedGuild = setupGuildFromInteraction(interaction);
    const managedPlaylist = managedGuild.getPlaylist();

    managedPlaylist.addMultiple(playlistItems);

    await managedGuild.ensurePlaying();

    await interaction.followUp('Playlist added!');
  }
}

/**
 * Method to search for a YouTube video to then add to the playlist
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {string} searchInput The video title to search for
 */
async function processVideoSearch(interaction, searchInput) {
  logger.debug('Processing a video search...', searchInput);

  const filters = await ytsr.getFilters(searchInput);
  const searchResult = await ytsr(filters.get('Type').get('Video').url, {
    limit: 1,
  });

  if (searchResult && searchResult.items.length > 0) {
    const link = searchResult.items[0].url;

    logger.debug('Found this link in the video search', link);

    await processVideoLink(interaction, link);
  } else {
    interaction.followUp(`Problem with input:\n\`${searchInput}\`\nReason: Could not find a video using search terms`);
  }
}

/**
 * Method to search for a YouTube playlist to then add to the playlist
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {string} searchInput The playlist title to search for
 */
async function processPlaylistSearch(interaction, searchInput) {
  logger.debug('Processing a video search...');

  const filters = await ytsr.getFilters(searchInput);
  const searchResult = await ytsr(filters.get('Type').get('Playlist').url, {
    limit: 1,
  });

  if (searchResult && searchResult.items.length > 0) {
    const link = searchResult.items[0].url;

    logger.debug('Found this link in the playlist search', link);

    await processPlaylistLink(interaction, link);
  } else {
    interaction.followUp(`Problem with input:\n\`${searchInput}\`\nReason: Could not find a playlist using search terms`);
  }
}

/**
 * Pull a representation of a video, if the link is valid
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {string} link A link to validate
 * @returns {object} Video object from YouTube API
 * @example Example unavailable video: https://www.youtube.com/watch?v=PE3IslWaB4E
 */
async function parseYouTubeVideoLink(interaction, link) {
  const isLinkToVideo = ytdl.validateURL(link);

  if (!isLinkToVideo) {
    await interaction.followUp(`Problem with link:\n\`${link}\`\nReason: It doesn't appear to be associated with YouTube`);
    return undefined;
  }

  const video = await ytdl.getInfo(link).catch(() => undefined);
  const isAvailable = video && video.formats.length > 0;

  if (!isAvailable) {
    await interaction.followUp(`Problem with link:\n\`${link}\`\nReason: It is not available`);
    return undefined;
  }

  return video;
}

/**
 * Pull a representation of a playlist, if the link is valid
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {string} link A link to validate
 * @returns {object} Playlist object from YouTube API
 */
async function parseYouTubePlaylistLink(interaction, link) {
  const isLinkToPlaylist = ytpl.validateID(link);

  if (!isLinkToPlaylist) {
    await interaction.followUp(`Problem with link:\n\`${link}\`\nReason: It doesn't appear to be associated with YouTube`);
    return undefined;
  }

  // if the playlist is unavailable because it's private, or unlisted, ytpl() will throw
  return ytpl(link).catch(async () => {
    await interaction.followUp(`Problem with link:\n\`${link}\`\nReason: It is not available`);
    return undefined;
  });
}

/**
 * Creates a guild in the app's memory
 *
 * @param {BaseInteraction} interaction User interaction object
 * @returns {Guild} Our guild model for this server
 */
function setupGuildFromInteraction(interaction) {
  const guildId = interaction.guild.id;
  const { channel } = interaction.member.voice;

  if (!GUILD_COLLECTION.hasGuild(guildId)) {
    GUILD_COLLECTION.createGuild(guildId, channel);
  }

  return GUILD_COLLECTION.getGuild(guildId);
}
