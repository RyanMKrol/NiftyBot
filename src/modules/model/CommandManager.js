/** @module Model */

import { shortCircuitPipeline } from 'noodle-utils';
import * as COMMANDS from '../commands';

/**
 * CommandManager
 */
class CommandManager {
  /**
   * constructor
   */
  constructor() {
    this.commands = COMMANDS;
  }

  /**
   * Process a message from a guild, and runs any associated commands
   *
   * @param {module:app.Message} messageHook Message containing a potential command
   */
  processCommand(messageHook) {
    const handleMethods = Object.keys(this.commands).map((command) => (hook) => {
      const shouldHandleResult = this.commands[command].shouldHandle(hook);

      // we have data, which means this command should handle the request
      if (shouldHandleResult !== null) {
        if (command === 'HELP') {
          this.commands[command].process(hook, this.getHelpData());
        } else {
          this.commands[command].process(hook, ...shouldHandleResult);
        }
        return true;
      }

      return false;
    });

    // short circuit pipeline runs methods until it sees true, it will run the above handleMethods
    // until one of them processes the message and returns true
    shortCircuitPipeline(...handleMethods)(messageHook);
  }

  /**
   * Creates the data used for the help command
   *
   * @returns {string} The help command output
   */
  getHelpData() {
    const keyLength = Object.keys(this.commands).reduce(
      (acc, commandName) => Math.max(acc, commandName.length),
      0,
    );

    return Object.keys(this.commands).reduce((outerAcc, command) => {
      const patterns = this.commands[command].getDisplayPatterns();

      const output = patterns.reduce(
        (innerAcc, pattern) => `${innerAcc}${`${command}:`.padEnd(keyLength + 1, ' ')} ${pattern}\n`,
        '',
      );

      return outerAcc + output;
    }, '');
  }
}

const COMMAND_MANAGER = new CommandManager();

export default COMMAND_MANAGER;
