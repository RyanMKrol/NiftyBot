import { COMMAND_PREFIX } from '../constants';

/**
 * Method to handle when the bot is added to a server
 *
 * @param {module:app.Guild} guild The guild that the bot has been added to
 */
async function onGuildCreate(guild) {
  guild.channels.cache
    .find((t) => t.name === 'general')
    .send(
      'Thanks for inviting my bot! You can use it via the following commands:\n'
        + `- \`${COMMAND_PREFIX}add <youtube_link>\`\n`
        + `- \`${COMMAND_PREFIX}remove <playlist_item_number>\`\n`
        + `- \`${COMMAND_PREFIX}list\`\n`
        + `- \`${COMMAND_PREFIX}clear\`\n`
        + `- \`${COMMAND_PREFIX}skip\`\n`
        + `- \`${COMMAND_PREFIX}pause\`\n`
        + `- \`${COMMAND_PREFIX}resume\`\n`
        + `- \`${COMMAND_PREFIX}quit\`\n`,
    );
}

export default onGuildCreate;
