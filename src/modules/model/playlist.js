/**
 * A model to track the playlist items
 */
class Playlist {
  /**
   * Constructor
   */
  constructor() {
    this.list = [];
  }

  /**
   * Add a link to the playlist
   *
   * @param {string} link the link to add to the playlist
   */
  add(link) {
    this.list.append(link);
    this.sync();
  }

  /**
   * Remove a link to the playlist
   *
   * @param {number} index The index of the item to remove from the playlist
   */
  remove(index) {
    this.list.splice(index - 1, 1);
    this.sync();
  }

  /**
   * Syncs the local playlist with persistant storage
   */
  sync() {
    process.stdout.write(`Current list is: ${this.list}`);
    // push data to storage
  }
}

export default Playlist;
