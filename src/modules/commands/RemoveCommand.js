/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * RemoveCommand
 */
export class RemoveCommand extends BaseCommand {
  /**
   * Constructor
   */
  constructor() {
    const patterns = [
      {
        pattern: `^${COMMAND_PREFIX}remove (.*)`,
        display: `${COMMAND_PREFIX}remove <playlist_item_number>`,
      },
    ];
    super(patterns);
  }

  /**
   * Process the remove command
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {number} removeIndex The number of song to remove from the playlist
   */
  async process(messageHook, removeIndex) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    manager.removeFromPlaylist(removeIndex);
    manager.listSongs(messageHook);
  }

  /**
   * Verifies that the current command is a remove command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues === null ? null : [parsedValues[1]];
  }
}

const REMOVE = new RemoveCommand();

export default REMOVE;
