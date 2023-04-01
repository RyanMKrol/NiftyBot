/**
 * Model to manage the playlist for a server
 */
export default class Playlist {
  /**
   * Constructor
   */
  constructor() {
    // TODO: Update references in this class to return {link: abc, title: abc}
    this.playlist = [];
  }

  /**
   * Add video to the end of a playlist
   *
   * @param {string} link URL of video to add
   */
  add(link) {
    this.playlist.push(link);
  }

  /**
   * Add multiple videos to the end of a playlist
   *
   * @param {Array<string>} links A list of URLs to add
   */
  addMultiple(links) {
    this.playlist.push(...links);
  }

  /**
   * Clear the playlist
   */
  clear() {
    this.playlist = [];
  }

  /**
   * Pull the next video from the top of the playlist
   *
   * @returns {string} URL to next video
   */
  next() {
    return this.playlist.shift();
  }

  /**
   * Checks if the playlist is empty
   *
   * @returns {boolean} Whether the playlist is empty
   */
  isEmpty() {
    return this.playlist.length === 0;
  }

  /**
   * Fetch the underlying playlist
   *
   * @returns {Array<object>} Underlying playlist
   */
  getPlaylist() {
    return this.playlist;
  }

  /**
   * Shuffle the values in the playlist
   */
  shuffle() {
    this.playlist.sort(() => Math.random() - 0.5);
  }
}
