import Player from './Player';
import PLAYLIST_COLLECTION from './PlaylistCollection';
import { CouldNotJoinChannel } from '../errors';

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
   * Ensures that the player is currently doing something
   *
   * @param {module:app.VoiceChannel} channel The VoiceChannel to play in
   */
  ensurePlaying(channel) {
    if (!this.player.isPlaying()) {
      this.play(channel);
    }
  }

  /**
   * Ensure the player is playing
   *
   * @param {module:app.VoiceChannel} channel The VoiceChannel to play in
   */
  play(channel) {
    const playlistItems = this.playlist.get();
    const channelToUse = this.currentChannel || channel;

    if (!channelToUse) {
      throw new CouldNotJoinChannel();
    }

    if (playlistItems.length > 0) {
      this.player.play(channelToUse, playlistItems[0]);
      this.currentChannel = channelToUse;
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
