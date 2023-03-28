import { SlashCommandBuilder, BaseInteraction } from 'discord.js';

import { GUILD_COLLECTION, Guild } from '../models';

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
        await processVideoLink(managedGuild, link);
        break;
      case ADD_COMMAND_NAMES.PLAYLIST:
        await processPlaylistLink(managedGuild, link);
        break;
      default:
        await interaction.editReply('Failed this miserably!');
        break;
    }

    await managedGuild.ensurePlaying();

    await interaction.editReply('Yup');
  },
};

/**
 * Method for adding a video to our playlist
 *
 * @param {Guild} managedGuild Our guild model for this server
 * @param {string} link The link to add to the playlist
 */
async function processVideoLink(managedGuild, link) {
  const playlist = managedGuild.getPlaylist();

  playlist.add(link);
}

/**
 * Method for adding a playlist of videos to our playlist
 *
 * @param {Guild} managedGuild Our guild model for this server
 * @param {string} link The link to unpack videos from, to add to our playlist
 */
async function processPlaylistLink(managedGuild, link) {
  const playlist = managedGuild.getPlaylist();

  playlist.add(link);
}
