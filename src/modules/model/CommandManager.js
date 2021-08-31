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
    this.commands = [...Object.values(COMMANDS)];
  }

  /**
   * Processes a message from a guild, and runs any associated commands
   *
   * @param {module:app.Message} messageHook Message containing a potential command
   */
  processCommand(messageHook) {
    const handleMethods = this.commands.map((command) => (hook) => {
      const shouldHandleResult = command.shouldHandle(hook);

      // we have data, which means this command should handle the request
      if (shouldHandleResult !== null) {
        command.process(hook, ...shouldHandleResult);
        return true;
      }

      return false;
    });

    // short circuit pipeline runs methods until it sees true, it will run the above handleMethods
    // until one of them processes the message and returns true
    shortCircuitPipeline(...handleMethods)(messageHook);
  }
}

const COMMAND_MANAGER = new CommandManager();

export default COMMAND_MANAGER;
