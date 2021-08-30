import Player from './Player';
import PLAYLIST_COLLECTION from './PlaylistCollection';
import { CouldNotJoinChannel } from '../errors';

const MAX_TITLE_OUTPUT_LENGTH = 40;

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
   * @param {JSON} videoInfo Information about the video
   */
  addToPlaylist(link, videoInfo) {
    this.playlist.add(link, videoInfo);
  }

  /**
   * List all songs in playlist
   *
   * @param {module:app.Message} responseHook The hook to reply with
   */
  listSongs(responseHook) {
    const titles = this.playlist.getDisplayNames();
    const output = titles.reduce(
      (acc, val, index) => `${acc}${index + 1}: ${formatTitle(val)}\n`,
      '',
    );

    if (titles.length === 0) {
      responseHook.reply("Here's the current playlist:\n```There's nothing here...```");
    } else {
      responseHook.reply(`Here's the current playlist:\n\`\`\`yaml\n${output}\`\`\``);
    }
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
   * Remove all songs from playlist
   */
  clearPlaylist() {
    this.playlist.clear();
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
    const playlistItems = this.playlist.getLinks();
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
   * Quit the player
   */
  quit() {
    this.player.quit();
  }

  /**
   * Pause the player
   */
  pause() {
    this.player.pause();
  }

  /**
   * Resume the player
   */
  resume() {
    this.player.resume();
  }

  /**
   * Informs the player that it's been disconnected
   */
  updatePlayerDisconnected() {
    this.player.setDisconnectedState();
  }
}

/**
 * Method to format the video titles to a uniform output
 *
 * @param {string} title Title of the video we're playing
 * @returns {string} A formatted title
 */
function formatTitle(title) {
  if (title.length <= MAX_TITLE_OUTPUT_LENGTH) {
    return title;
  }

  return `${title.substring(0, MAX_TITLE_OUTPUT_LENGTH - 3)}...`;
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
