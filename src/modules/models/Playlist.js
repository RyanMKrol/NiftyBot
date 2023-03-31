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
    // unshift adds to the front
    this.playlist.unshift(link);
  }

  /**
   * Add multiple videos to the end of a playlist
   *
   * @param {Array<string>} links A list of URLs to add
   */
  addMultiple(links) {
    // I'm reversing the order here because we want the first items in the list of links
    // to be toward the "back" of our managed playlist. The items at the back play first,
    // and I want to maintain the order of the playlist that's been added
    this.playlist.unshift(...links.reverse());
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
    // pop pops from the end
    return this.playlist.pop();
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
}
