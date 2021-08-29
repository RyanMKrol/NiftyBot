import { COMMAND_PREFIX } from '../constants';

/**
 * Method to handle when the bot is messaged by a user
 *
 * @param {module:app.Message} message The message that the user has sent
 */
async function onMessage(message) {
  console.log(COMMAND_PREFIX, message);
}

export default onMessage;
