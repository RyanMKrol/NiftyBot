/* eslint-disable class-methods-use-this */

import BaseCommand from './BaseCommand';

import { COMMAND_PREFIX } from '../constants';

/**
 * HelpCommand
 */
export class HelpCommand extends BaseCommand {
  /**
   * Constructor
   */
  constructor() {
    const patterns = [`^${COMMAND_PREFIX}help`];
    super(patterns);
  }

  /**
   * Process the help command
   *
   * @param {module:app.Message} messageHook The original message hook
   * @param {string} helpData String containing list of commands we can use
   */
  async process(messageHook, helpData) {
    messageHook.reply(`Here are the commands:\n\`\`\`${helpData}\`\`\`\n`);
  }

  /**
   * Verifies that the current command is a help command
   *
   * @param {string} command The command being used
   * @returns {Array<any>} Array of parsed parameters
   */
  shouldHandle(command) {
    const parsedValues = new RegExp(this.getPatterns()[0]).exec(command);
    return parsedValues;
  }
}

const HELP = new HelpCommand();

export default HELP;
