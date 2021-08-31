// credential constants
import AWS_CREDENTIALS from '../../../credentials/aws.json';
import DISCORD_CREDENTIALS from '../../../credentials/discord.json';

// command constants
const COMMAND_PREFIX = '!';
const PLAYLISTS_BUCKET_NAME = 'nifty-bot-playlists';

const BOT_ID = '881636306092982302';

const HELP_DATA = 'Here are the commands:\n'
  + `- \`${COMMAND_PREFIX}add <youtube_link>\`\n`
  + `- \`${COMMAND_PREFIX}play <youtube_link>\`\n`
  + `- \`${COMMAND_PREFIX}remove <playlist_item_number>\`\n`
  + `- \`${COMMAND_PREFIX}list\`\n`
  + `- \`${COMMAND_PREFIX}clear\`\n`
  + `- \`${COMMAND_PREFIX}skip\`\n`
  + `- \`${COMMAND_PREFIX}pause\`\n`
  + `- \`${COMMAND_PREFIX}resume\`\n`
  + `- \`${COMMAND_PREFIX}quit\`\n`
  + `- \`${COMMAND_PREFIX}help\`\n`;

export {
  AWS_CREDENTIALS,
  BOT_ID,
  HELP_DATA,
  DISCORD_CREDENTIALS,
  COMMAND_PREFIX,
  PLAYLISTS_BUCKET_NAME,
};
