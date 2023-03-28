import Guild from './guild';

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
   * @param {Guild} guild The guild to add
   */
  addGuild(guild) {
    this.guilds[guild.getId()] = guild;
  }
}

// export only a single guild collection for the entire application
const GUILD_COLLECTION = new GuildCollection();
export default GUILD_COLLECTION;
