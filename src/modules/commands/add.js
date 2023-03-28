/* eslint-disable */
import { SlashCommandBuilder } from 'discord.js';

import {
  joinVoiceChannel,
   VoiceConnectionStatus,
    createAudioResource,
     createAudioPlayer,
      StreamType,
      NoSubscriberBehavior,
      AudioPlayerStatus
} from '@discordjs/voice';

import ytdl from 'ytdl-core';

import logger from '../logger';

const playerDebug = require('debug')("NiftyBot:PlayerStatus")

export default {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a song to the playlist')
    .addSubcommand((subcommand) => subcommand
      .setName('video')
      .setDescription('Add a YouTube video to the playlist')
      .addStringOption((option) => option.setName('link')
        .setDescription('A link to a YouTube video')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('playlist')
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
    const { channel } = interaction.member.voice;

    if (channel === null) {
      interaction.reply('Get yourself in a voice channel to start using this bot!');
      return;
    }

    logger.debug('joining voice channel');
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    logger.debug('creating a video stream');
    /* eslint-disable-next-line */
    let stream = await ytdl('https://www.youtube.com/watch?v=Yifz3X_i-F8&ab_channel=MellowUploads', {
      filter: 'audioonly',
    });

    logger.debug('creating a video player');
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    player.on(AudioPlayerStatus.Idle, () => {
      playerDebug('Player Status: Idle!');
    });
    player.on(AudioPlayerStatus.Buffering, () => {
      playerDebug('Player Status: Buffering!');
    });
    player.on(AudioPlayerStatus.AutoPaused, () => {
      playerDebug('Player Status: AutoPaused!');
    });
    player.on(AudioPlayerStatus.Playing, () => {
      playerDebug('Player Status: Playing!');
    });
    player.on(AudioPlayerStatus.Paused, () => {
      playerDebug('Player Status: Paused!');
    });
    player.on('error', error => {
      console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
      player.play(getNextResource());
    });
    // const resource = createAudioResource(stream, { inputType: StreamType.Opus });

    console.log(__dirname)
    console.log(__dirname+'/../../../sample.mp3')
    const resource = createAudioResource(__dirname+'/../../../sample.mp3', {
      metadata: {
        title: 'A good song!',
      },
    });

    console.log(resource)


    logger.debug('setting up on video handlers');
    connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
      logger.debug('playing the video i guess');
      connection.subscribe(player);
      logger.debug('subscribed');
      logger.debug('playing');
      player.play(resource);
    });

    await interaction.reply('Playing your video!');
  },
};
