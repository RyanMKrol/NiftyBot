import { SlashCommandBuilder, BaseInteraction } from 'discord.js';
import ytpl from 'ytpl';
import ytdl from 'ytdl-core';

import { GUILD_COLLECTION, Guild } from '../models';
import { logger } from '../logger';

const ADD_COMMAND_NAMES = {
  VIDEO: 'video',
  PLAYLIST: 'playlist',
};

export default {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add to the playlist')
    .addSubcommand((subcommand) => subcommand
      .setName(ADD_COMMAND_NAMES.VIDEO)
      .setDescription('Add a YouTube video to the playlist')
      .addStringOption((option) => option.setName('link')
        .setDescription('A link to a YouTube video')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName(ADD_COMMAND_NAMES.PLAYLIST)
      .setDescription('Add a YouTube playlist to the playlist')
      .addStringOption((option) => option.setName('link')
        .setDescription('A link to a YouTube playlist')
        .setRequired(true))),

  /**
   * Executes the command
   *
   * @param {BaseInteraction} interaction User interaction object
   */
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const { channel } = interaction.member.voice;
    const link = interaction.options.getString('link');

    if (channel === null) {
      interaction.reply('You have to be in a voice channel to add something!');
      return;
    }

    // TODO - Maybe only do this when you've confirmed that you have a video to play
    // currently, it's possible to have one of these but fail validation on the link...
    if (!GUILD_COLLECTION.hasGuild(guildId)) {
      GUILD_COLLECTION.createGuild(guildId, channel);
    }

    const managedGuild = GUILD_COLLECTION.getGuild(guildId);

    // the next bit of processing may take time, and discord demands a response within 3s,
    // deferReply, extends that window for us by displaying something to the user before we
    // actually reply
    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case ADD_COMMAND_NAMES.VIDEO:
        await processVideoLink(interaction, managedGuild, link);
        break;
      case ADD_COMMAND_NAMES.PLAYLIST:
        await processPlaylistLink(interaction, managedGuild, link);
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
 * @param {Guild} managedGuild Our guild model for this server
 * @param {string} link The link to add to the playlist
 * @example Example unavailable video: https://www.youtube.com/watch?v=PE3IslWaB4E
 */
async function processVideoLink(interaction, managedGuild, link) {
  logger.debug('Processing a video link...');

  const video = await parseYouTubeVideoLink(interaction, link);

  if (video) {
    logger.debug('Adding video to playlist...');

    const managedPlaylist = managedGuild.getPlaylist();
    managedPlaylist.add({
      link,
      title: video.videoDetails.title,
    });

    await managedGuild.ensurePlaying();
  }
}

/**
 * Method for adding a playlist of videos to our playlist
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {Guild} managedGuild Our guild model for this server
 * @param {string} link The link to unpack videos from, to add to our playlist
 */
async function processPlaylistLink(interaction, managedGuild, link) {
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

    const managedPlaylist = managedGuild.getPlaylist();
    managedPlaylist.addMultiple(playlistItems);

    await managedGuild.ensurePlaying();
  }
}

/**
 * Pull a representation of a video, if the link is valid
 *
 * @param {BaseInteraction} interaction User interaction object
 * @param {string} link A link to validate
 * @returns {object} Video object from YouTube API
 */
async function parseYouTubeVideoLink(interaction, link) {
  const isLinkToVideo = ytdl.validateURL(link);

  if (!isLinkToVideo) {
    await interaction.followUp(`Link: ${link}, doesn't appear to be associated with YouTube`);
    return undefined;
  }

  const video = await ytdl.getInfo(link).catch(() => undefined);
  const isAvailable = video && video.formats.length > 0;

  if (!isAvailable) {
    await interaction.followUp(`Link: ${link}, is not available`);
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
  const isLinkToPlaylist = await ytpl.validateID(link);

  if (!isLinkToPlaylist) {
    await interaction.followUp(`Link: ${link}, doesn't appear to be associated with YouTube`);
    return undefined;
  }

  // if the playlist is unavailable because it's private, or unlisted, ytpl() will throw
  return ytpl(link).catch(async () => {
    await interaction.followUp(`Link: ${link}, the playlist doesn't appear to be available`);
    return undefined;
  });
}
