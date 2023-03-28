import { v4 as uuidv4 } from 'uuid';

import Player from './player';
import Playlist from './playlist';

/**
 * Model to manage the guild (server)
 */
export default class Guild {
  /**
   * Constructor
   */
  constructor() {
    this.playlist = new Playlist();
    this.player = new Player();
    this.id = uuidv4();
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
}
