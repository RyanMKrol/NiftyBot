import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  VoiceState,
} from '@discordjs/voice';

import Player from './player';
import Playlist from './playlist';
import { logger } from '../logger';

/**
 * Model to manage the guild (server)
 */
export default class Guild {
  /**
   * Constructor
   *
   * @param {string} guildId The ID of the guild we're adding
   * @param {VoiceState} initialVoiceChannel The voice channel we start adding the connection to
   */
  constructor(guildId, initialVoiceChannel) {
    this.id = guildId;
    this.playlist = new Playlist();
    this.player = new Player();

    logger.debug('Joining voice channel and setting up connection');
    this.connection = joinVoiceChannel({
      channelId: initialVoiceChannel.id,
      guildId,
      adapterCreator: initialVoiceChannel.guild.voiceAdapterCreator,
    });
    this.connection.on(VoiceConnectionStatus.Ready, () => {
      logger.debug('Connection is ready to play video');
      this.player.registerSubscriber(this.connection);
    });
  }

  /**
   * Return the playlist
   *
   * @returns {Playlist} The playlist
   */
  getPlaylist() {
    return this.playlist;
  }

  /**
   * Return the player
   *
   * @returns {Player} The player
   */
  getPlayer() {
    return this.player;
  }

  /**
   * Return the ID
   *
   * @returns {string} The ID
   */
  getId() {
    return this.id;
  }

  /**
   * Cleans up connections, and players
   */
  quit() {
    logger.debug('Performing guild cleanup tasks...');
    this.player.quit();
    this.connection.destroy();
  }
}
