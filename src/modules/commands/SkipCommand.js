/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * SkipCommand
 */
export class SkipCommand extends BaseCommand {
  /**
   * constructor
   */
  constructor() {
    const patterns = [
      {
        pattern: `^${COMMAND_PREFIX}skip`,
        display: `${COMMAND_PREFIX}skip`,
      },
    ];
    super(patterns);
  }

  /**
   * Process the skip command
   *
   * @param {module:app.Message} messageHook The original message hook
   */
  async process(messageHook) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    manager.next();
    manager.listSongs(messageHook);
  }

  /**
   * Verifies that the current command is a skip command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues;
  }
}

const SKIP = new SkipCommand();

export default SKIP;
