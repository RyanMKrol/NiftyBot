/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * QuitCommand
 */
export class QuitCommand extends BaseCommand {
  /**
   * constructor
   */
  constructor() {
    const patterns = [
      {
        pattern: `^${COMMAND_PREFIX}quit`,
        display: `${COMMAND_PREFIX}quit`,
      },
    ];
    super(patterns);
  }

  /**
   * Process the quit command
   *
   * @param {module:app.Message} messageHook The original message hook
   */
  async process(messageHook) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    manager.quit();
  }

  /**
   * Verifies that the current command is a quit command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues;
  }
}

const QUIT = new QuitCommand();

export default QUIT;
