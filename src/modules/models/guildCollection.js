import {
  VoiceState,
} from '@discordjs/voice';

import Guild from './guild';
import { logger } from '../logger';

/**
 * Model to manage a guild (server) collection
 */
class GuildCollection {
  /**
   * Constructor
   */
  constructor() {
    this.guilds = {};
  }

  /**
   * Checks if a guild is in the collection
   *
   * @param {string} guildId The ID of the guild to check
   * @returns {boolean} Whether the guild is in the collection
   */
  hasGuild(guildId) {
    const doesHaveGuild = typeof this.guilds[guildId] !== 'undefined';

    logger.debug('Checking if guild collection has guild', guildId, doesHaveGuild);

    return doesHaveGuild;
  }

  /**
   * Return a Guild
   *
   * @param {string} guildId The ID of the guild to fetch
   * @returns {Guild} The playlist
   */
  getGuild(guildId) {
    return this.guilds[guildId];
  }

  /**
   * Adds a guild to the collection
   *
   * @param {string} guildId The ID of the guild we're adding
   * @param {VoiceState} initialVoiceChannel The voice channel we start adding the connection to
   */
  createGuild(guildId, initialVoiceChannel) {
    logger.debug('Adding a guild to the collection');
    this.guilds[guildId] = new Guild(guildId, initialVoiceChannel, () => this.removeGuild(guildId));
  }

  /**
   * Remove a guild from the collection
   *
   * @param {string} guildId The ID of the guild to remove
   */
  removeGuild(guildId) {
    logger.debug('Removing a guild from the collection');

    this.guilds[guildId].quit();

    delete this.guilds[guildId];
  }
}

// export only a single guild collection for the entire application
const GUILD_COLLECTION = new GuildCollection();
export default GUILD_COLLECTION;
