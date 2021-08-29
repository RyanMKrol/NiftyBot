import { PLAYLISTS_BUCKET_NAME } from '../constants';
import { downloadFile } from '../data';

/**
 * A collection Playlists
 */
export class PlaylistCollection {
  /**
   * Constructs a collection Playlists
   */
  constructor() {
    this.playlists = {};
  }

  /**
   * Get a playlist from either local or persistant storage
   *
   * @param {string} guildId The guild ID to get the playlist for
   */
  async getPlaylist(guildId) {
    if (this.playlists[guildId]) {
      return this.playlists[guildId];
    }

    downloadFile(PLAYLISTS_BUCKET_NAME, guildId)
      .then((data) => {
        process.stdout.write(data);
      })
      .catch((error) => {
        process.stdout.write(error);
      });

    return [];
    // read data from s3, build a new playlist, and store in local memory
  }
}

const playlists = new PlaylistCollection();

export default playlists;
