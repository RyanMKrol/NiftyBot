import { HELP_DATA } from '../constants';

/**
 * Method to handle when the bot is added to a server
 *
 * @param {module:app.Guild} guild The guild that the bot has been added to
 */
async function onGuildCreate(guild) {
  guild.channels.cache
    .find((t) => t.name === 'general')
    .send(`Thanks for inviting my bot to your server!\n${HELP_DATA}`);
}

export default onGuildCreate;
