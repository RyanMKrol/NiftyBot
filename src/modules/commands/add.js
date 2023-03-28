import { SlashCommandBuilder, BaseInteraction } from 'discord.js';

import GUILD_COLLECTION from '../models/guildCollection';

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

    if (channel === null) {
      interaction.reply('You have to be in a voice channel to add something!');
      return;
    }

    await interaction.deferReply();

    if (!GUILD_COLLECTION.hasGuild(guildId)) {
      GUILD_COLLECTION.createGuild(guildId, channel);
    }

    // switch (interaction.options.getSubcommand()) {
    //   case ADD_COMMAND_NAMES.VIDEO:
    //     await interaction.editReply(ADD_COMMAND_NAMES.VIDEO);
    //     break;
    //   case ADD_COMMAND_NAMES.PLAYLIST:
    //     await interaction.editReply(ADD_COMMAND_NAMES.PLAYLIST);
    //     break;
    //   default:
    //     await interaction.editReply('Failed this miserably!');
    //     break;
    // }

    const managedGuild = GUILD_COLLECTION.getGuild(guildId);
    const playlist = managedGuild.getPlaylist();

    playlist.add('https://www.youtube.com/watch?v=GM_3IlttE-I&ab_channel=TIMER');

    console.log(playlist);
    await managedGuild.ensurePlaying();
  },
};
