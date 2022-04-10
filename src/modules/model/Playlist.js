/** @module Model */

import { PLAYLISTS_BUCKET_NAME } from '../constants';
import { uploadFile } from '../data';

/**
 * Playlist
 */
class Playlist {
  /**
   * constructor
   *
   * @param {Array<string>} list A list of links to pre-populate the playlist with
   * @param {string} guildId The guild ID that this playlist exists for
   */
  constructor(list, guildId) {
    this.list = list || [];
    this.id = guildId;
  }

  /**
   * Add an item to the playlist
   *
   * @param {JSON} data Object contianing the link to the song, and the title of the song
   */
  add(data) {
    this.list.push(data);
    this.sync();
  }

  /**
   * Add multiple items to the playlist
   *
   * @param {Array<JSON>} data Array containing playlist items to add
   */
  addMultiple(data) {
    this.list = this.list.concat(data);
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
   * Remove all links from playlist
   */
  clear() {
    this.list = [];
    this.sync();
  }

  /**
   * Shuffles the links in the playlist
   */
  async shuffle() {
    const currentItem = this.list[0];
    const remainingList = this.list.slice(1);

    remainingList.sort(() => Math.random() - 0.5);
    this.list = [currentItem, ...remainingList];

    await this.sync();
  }

  /**
   * Get the playlist items' links
   *
   * @returns {Array<string>} Array of links
   */
  getLinks() {
    return this.list.map((item) => item.link);
  }

  /**
   * Get the playlist items' display names
   *
   * @returns {Array<string>} Array of display names
   */
  getDisplayNames() {
    return this.list.map((item) => item.title);
  }

  /**
   * Syncs the local playlist with persistant storage
   */
  async sync() {
    await uploadFile(PLAYLISTS_BUCKET_NAME, this.id, JSON.stringify(this.list));
  }
}

export default Playlist;
