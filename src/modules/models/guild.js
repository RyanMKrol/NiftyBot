import { getVoiceConnection } from '@discordjs/voice';

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
   */
  constructor(guildId) {
    this.playlist = new Playlist();
    this.player = new Player();
    this.id = guildId;
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

    const connection = getVoiceConnection(this.id);
    connection.destroy();
  }
}
