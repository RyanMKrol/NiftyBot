import { SlashCommandBuilder } from 'discord.js';

import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioResource,
} from '@discordjs/voice';

import ytdl from 'ytdl-core';

import { logger } from '../logger';

import Guild from '../models/guild';
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
   * @param {object} interaction User interaction object
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
      GUILD_COLLECTION.addGuild(new Guild(guildId));
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

    console.log(GUILD_COLLECTION.getGuild(guildId));
    console.log(GUILD_COLLECTION.getGuild(guildId).getPlayer());
    const player = GUILD_COLLECTION.getGuild(guildId).getPlayer();

    logger.debug('Joining a voice channel');
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    logger.debug('Creating an audio player');

    logger.debug('Setting up stream of YouTube video');
    const rawStream = await ytdl('https://www.youtube.com/watch?v=EHIHl8Rw6W8&ab_channel=tomcardy', {
      filter: 'audioonly',
    });

    const playerResource = createAudioResource(rawStream);

    connection.on(VoiceConnectionStatus.Ready, () => {
      logger.debug('Connection is ready to play video');
      player.registerSubscriber(connection);

      logger.debug('Playing resource');
      player.play(playerResource);
    });
  },
};
