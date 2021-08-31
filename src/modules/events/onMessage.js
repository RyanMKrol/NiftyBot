import { COMMAND_MANAGER } from '../model';

/**
 * Method to handle when the bot is messaged by a user
 *
 * @param {module:app.Message} message The message that the user has sent
 */
async function onMessage(message) {
  COMMAND_MANAGER.processCommand(message);
}

export default onMessage;
