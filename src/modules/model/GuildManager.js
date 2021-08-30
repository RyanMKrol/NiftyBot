import Player from './Player';
import PLAYLIST_COLLECTION from './PlaylistCollection';

/**
 * GuildManager
 */
class GuildManager {
  /**
   * @param {Player} player The player
   * @param {Playlist} playlist The playlist
   */
  constructor(player, playlist) {
    this.player = player;
    this.playlist = playlist;
  }

  /**
   * Add song to playlist
   *
   * @param {string} link Link to add to playlist
   */
  addToPlaylist(link) {
    this.playlist.add(link);
  }

  /**
   * List all songs in playlist
   *
   * @returns {Array<string>} The songs in the playlist
   */
  listSongs() {
    return this.playlist.get();
  }

  /**
   * Remove song from playlist
   *
   * @param {number} index The index to remove from
   */
  removeFromPlaylist(index) {
    this.playlist.remove(index);
  }

  /**
   * Skip the current track
   */
  skip() {
    this.playlist.remove(0);

    const remaining = this.playlist.get();
    if (remaining.length > 0) {
      this.player.play(remaining[0]);
    }
  }

  /**
   * Stop the player from playing
   */
  stop() {
    this.player.stop();
  }
}

/**
 * Method to create a GuildManager object
 *
 * @param {string} guildId The Guild ID to manage
 * @returns {GuildManager} A GuildManager
 */
async function createGuildManagerInstance(guildId) {
  const player = new Player();
  const playlist = await PLAYLIST_COLLECTION.getPlaylist(guildId);

  return new GuildManager(player, playlist);
}

export default createGuildManagerInstance;
