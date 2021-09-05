import { COMMAND_MANAGER } from '../model';

/**
 * Handle when the bot is messaged by a user
 *
 * @param {module:app.Message} messageHook The original message hook
 */
async function onMessage(messageHook) {
  COMMAND_MANAGER.processCommand(messageHook);
}

export default onMessage;
