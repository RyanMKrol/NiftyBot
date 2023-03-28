import { SlashCommandBuilder } from 'discord.js';

import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import logger from '../logger';

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

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
      logger.debug('Can now start playing something!');
      logger.debug(oldState, newState);
    });

    await interaction.reply('Playing your video!');
  },
};
