import { shortCircuitPipeline } from 'noodle-utils';

import {
  add, list, remove, skip,
} from '../commands';

/**
 * Method to handle when the bot is messaged by a user
 *
 * @param {module:app.Message} message The message that the user has sent
 */
async function onMessage(message) {
  shortCircuitPipeline(add, list, remove, skip)(message);
}

export default onMessage;
