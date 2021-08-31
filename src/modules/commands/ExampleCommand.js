/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * ExampleCommand
 */
export class ExampleCommand extends BaseCommand {
  /**
   * Constructor
   */
  constructor() {
    const patterns = [`^${COMMAND_PREFIX}example`];
    super(patterns);
  }

  /**
   * Process the example command
   *
   * @param {module:app.Message} messageHook The hook that contains the command being used
   */
  async process(messageHook) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    manager.listSongs(messageHook);
  }

  /**
   * Verifies that the current command is a example command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues;
  }
}

const EXAMPLE = new ExampleCommand();

export default EXAMPLE;
