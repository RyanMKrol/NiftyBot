/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * ClearCommand
 */
export class ClearCommand extends BaseCommand {
  /**
   * constructor
   */
  constructor() {
    const patterns = [
      {
        pattern: `^${COMMAND_PREFIX}clear`,
        display: `${COMMAND_PREFIX}clear`,
      },
    ];
    super(patterns);
  }

  /**
   * Process the clear command
   *
   * @param {module:app.Message} messageHook The original message hook
   */
  async process(messageHook) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    manager.clearPlaylist();
    manager.listSongs(messageHook);
  }

  /**
   * Verifies that the current command is a clear command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues;
  }
}

const CLEAR = new ClearCommand();

export default CLEAR;
