import Player from './Player';
import PLAYLIST_COLLECTION from './PlaylistCollection';

/**
 * GuildManager
 */
class GuildManager {
  /**
   * @param {Playlist} playlist The playlist
   */
  constructor(playlist) {
    this.player = new Player(() => this.next());
    this.playlist = playlist;
    this.currentChannel = undefined;
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
   * Ensure the player is playing
   *
   * @param {string} channel The channel to play in
   */
  play(channel) {
    const playlistItems = this.playlist.get();

    if (playlistItems.length > 0 && !this.player.isPlaying()) {
      this.player.play(channel, playlistItems[0]);
      this.currentChannel = channel;
    }
  }

  /**
   * Play the next song in the playlist
   */
  next() {
    this.playlist.remove(1);
    this.play();
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
  const playlist = await PLAYLIST_COLLECTION.getPlaylist(guildId);

  return new GuildManager(playlist);
}

export default createGuildManagerInstance;
