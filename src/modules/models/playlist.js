/**
 * Model to manage the playlist for a server
 */
export default class Playlist {
  /**
   * Constructor
   */
  constructor() {
    this.playlist = [];
  }

  /**
   * Add video to the end of a playlist
   *
   * @param {string} link URL of video to add
   */
  add(link) {
    // unshift adds to the front
    this.playlist.unshift(link);
  }

  /**
   * Pull the next video from the top of the playlist
   *
   * @returns {string} URL to next video
   */
  next() {
    // pop pops from the end
    return this.playlist.pop();
  }
}
