import { SlashCommandBuilder } from 'discord.js';

// import {
//   joinVoiceChannel,
//   VoiceConnectionStatus,
//   createAudioResource,
// } from '@discordjs/voice';

// import ytdl from 'ytdl-core';

// import { logger } from '../logger';

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
      interaction.reply('You have to be in a voice channel to add something!');
      return;
    }
    await interaction.deferReply();

    // logger.debug('Joining a voice channel');
    // const connection = joinVoiceChannel({
    //   channelId: channel.id,
    //   guildId: interaction.guild.id,
    //   adapterCreator: channel.guild.voiceAdapterCreator,
    // });

    // logger.debug('Creating an audio player');

    // logger.debug('Setting up stream of YouTube video');
    // const rawStream = await ytdl('https://www.youtube.com/watch?v=EHIHl8Rw6W8&ab_channel=tomcardy', {
    //   filter: 'audioonly',
    // });
    // const playerResource = createAudioResource(rawStream);

    // connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
    //   logger.debug('Connection is ready to play video');
    //   connection.subscribe(player);

    //   logger.debug('Playing resource');
    //   player.play(playerResource);
    // });

    await interaction.editReply('Playing your video!');
  },
};
