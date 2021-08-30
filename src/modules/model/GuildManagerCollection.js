import createGuildManagerInstance from './GuildManager';

/**
 * A collection GuildManagers
 */
export class GuildManagerCollection {
  /**
   * Constructs a collection of GuildManagers
   */
  constructor() {
    this.guildManagers = {};
  }

  /**
   * Either get a GuildManager, or create one
   *
   * @param {string} guildId The guild ID to get the GuildManager for
   * @returns {GuildManager} The GuildManager for this guild ID
   */
  async getManager(guildId) {
    if (this.guildManagers[guildId]) {
      return this.guildManagers[guildId];
    }

    this.guildManagers[guildId] = await createGuildManagerInstance(guildId);

    return this.guildManagers[guildId];
  }
}

const GUILD_MANAGER_COLLECTION = new GuildManagerCollection();

export default GUILD_MANAGER_COLLECTION;
