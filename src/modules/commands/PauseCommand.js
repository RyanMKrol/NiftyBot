/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';

/**
 * PauseCommand
 */
export class PauseCommand extends BaseCommand {
  /**
   * Constructor
   */
  constructor() {
    const patterns = [`^${COMMAND_PREFIX}pause`];
    super(patterns);
  }

  /**
   * Process the pause command
   *
   * @param {module:app.Message} messageHook The original message hook
   */
  async process(messageHook) {
    const guildId = messageHook.channel.guild.id;
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);

    manager.pause();
  }

  /**
   * Verifies that the current command is a pause command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues;
  }
}

const PAUSE = new PauseCommand();

export default PAUSE;
