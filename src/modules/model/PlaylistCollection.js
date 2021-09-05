/** @module Model */

import { PLAYLISTS_BUCKET_NAME } from '../constants';
import { downloadFile } from '../data';
import Playlist from './Playlist';

/**
 * PlaylistCollection
 */
export class PlaylistCollection {
  /**
   * constructor
   */
  constructor() {
    this.playlists = {};
  }

  /**
   * Get a playlist from either local or persistant storage
   *
   * @param {string} guildId The guild ID to get the playlist for
   * @returns {Playlist} The playlist for this guild
   */
  async getPlaylist(guildId) {
    if (this.playlists[guildId]) {
      return this.playlists[guildId];
    }

    await downloadFile(PLAYLISTS_BUCKET_NAME, guildId)
      .then((data) => {
        this.playlists[guildId] = new Playlist(JSON.parse(data), guildId);
      })
      .catch(() => {
        this.playlists[guildId] = new Playlist([], guildId);
      });

    return this.playlists[guildId];
  }
}

const PLAYLIST_COLLECTION = new PlaylistCollection();

export default PLAYLIST_COLLECTION;
