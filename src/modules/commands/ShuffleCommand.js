/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * ShuffleCommand
 */
export class ShuffleCommand extends BaseCommand {
  /**
   * constructor
   */
  constructor() {
    const patterns = [
      {
        pattern: `^${COMMAND_PREFIX}shuffle`,
        display: `${COMMAND_PREFIX}shuffle`,
      },
    ];
    super(patterns);
  }

  /**
   * Process the shuffle command
   *
   * @param {module:app.Message} messageHook The original message hook
   */
  async process(messageHook) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    await manager.shuffle();
    manager.listSongs(messageHook);
  }

  /**
   * Verifies that the current command is a shuffle command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues;
  }
}

const SHUFFLE = new ShuffleCommand();

export default SHUFFLE;
