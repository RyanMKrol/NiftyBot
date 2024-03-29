import { SlashCommandBuilder, BaseInteraction } from 'discord.js';
import { logger } from '../logger';
import { Player } from '../models';
import GUILD_COLLECTION from '../models/GuildCollection';

const PLAYER_COMMAND_NAMES = {
  PAUSE: 'pause',
  RESUME: 'resume',
  SKIP: 'skip',
  CLEAR: 'clear',
  LIST: 'list',
  SHUFFLE: 'shuffle',
  QUIT: 'quit',
};

/**
 * Fetch the player associated with a given server ID
 *
 * @param {string} guildId The server's ID
 * @returns {Player} The player object
 */
function fetchPlayerForGuild(guildId) {
  logger.debug('Fetching the player for server with ID: ', guildId);

  const guild = GUILD_COLLECTION.getGuild(guildId);
  return guild.getPlayer();
}

/**
 * Pause playback on the player
 *
 * @param {string} guildId The server's ID
 */
function pause(guildId) {
  logger.debug('Pausing playback on server with ID: ', guildId);

  const player = fetchPlayerForGuild(guildId);
  player.pause();
}

/**
 * Resume playback on the player
 *
 * @param {string} guildId The server's ID
 */
function resume(guildId) {
  logger.debug('Resuming playback on server with ID: ', guildId);

  const player = fetchPlayerForGuild(guildId);
  player.resume();
}

/**
 * Skip this video
 *
 * @param {string} guildId The server's ID
 */
async function skip(guildId) {
  logger.debug('Skipping video on server with ID: ', guildId);

  const guild = GUILD_COLLECTION.getGuild(guildId);
  await guild.playNextVideo();
}

/**
 * Clear the remainder of the playlist
 *
 * @param {string} guildId The server's ID
 */
async function clear(guildId) {
  logger.debug('Clearing the playlist on server with ID: ', guildId);

  const guild = GUILD_COLLECTION.getGuild(guildId);
  guild.clearPlaylist();
}

/**
 * Print the remainder of the playlist
 *
 * @param {string} guildId The server's ID
 * @param {BaseInteraction} interaction The user interaction
 */
async function list(guildId, interaction) {
  logger.debug('Printing the playlist on server with ID: ', guildId);

  const guild = GUILD_COLLECTION.getGuild(guildId);
  const output = guild.getPlaylistToString();

  interaction.reply(output);
}

/**
 * Shuffle the remainder of the playlist
 *
 * @param {string} guildId The server's ID
 */
async function shuffle(guildId) {
  logger.debug('Shuffling the playlist on server with ID: ', guildId);

  const guild = GUILD_COLLECTION.getGuild(guildId);
  guild.shufflePlaylist();
}

/**
 * Removes the player from the server
 *
 * @param {string} guildId The server's ID
 */
function quit(guildId) {
  logger.debug('Removing player on server with ID: ', guildId);

  GUILD_COLLECTION.removeGuild(guildId);
}

export default {
  data: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Control the player')
    .addSubcommand((subcommand) => subcommand
      .setName(PLAYER_COMMAND_NAMES.PAUSE)
      .setDescription('Pauses the player'))
    .addSubcommand((subcommand) => subcommand
      .setName(PLAYER_COMMAND_NAMES.RESUME)
      .setDescription('Resumes the player'))
    .addSubcommand((subcommand) => subcommand
      .setName(PLAYER_COMMAND_NAMES.SKIP)
      .setDescription('Skips the current video'))
    .addSubcommand((subcommand) => subcommand
      .setName(PLAYER_COMMAND_NAMES.CLEAR)
      .setDescription('Clears the playlist'))
    .addSubcommand((subcommand) => subcommand
      .setName(PLAYER_COMMAND_NAMES.LIST)
      .setDescription('Lists the playlist'))
    .addSubcommand((subcommand) => subcommand
      .setName(PLAYER_COMMAND_NAMES.SHUFFLE)
      .setDescription('Shuffles the playlist'))
    .addSubcommand((subcommand) => subcommand
      .setName(PLAYER_COMMAND_NAMES.QUIT)
      .setDescription('Removes the player from voice chat')),

  /**
   * Executes the command
   *
   * @param {BaseInteraction} interaction The user interaction
   */
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!GUILD_COLLECTION.hasGuild(guildId)) {
      await interaction.reply('NiftyBot is sleeping...');
      return;
    }

    switch (interaction.options.getSubcommand()) {
      case PLAYER_COMMAND_NAMES.PAUSE:
        pause(guildId);
        await interaction.reply('Pausing...');
        break;
      case PLAYER_COMMAND_NAMES.RESUME:
        resume(guildId);
        await interaction.reply('Resuming...');
        break;
      case PLAYER_COMMAND_NAMES.SKIP:
        await skip(guildId);
        await interaction.reply(PLAYER_COMMAND_NAMES.SKIP);
        break;
      case PLAYER_COMMAND_NAMES.CLEAR:
        clear(guildId);
        list(guildId, interaction);
        break;
      case PLAYER_COMMAND_NAMES.LIST:
        list(guildId, interaction);
        break;
      case PLAYER_COMMAND_NAMES.SHUFFLE:
        shuffle(guildId);
        list(guildId, interaction);
        break;
      case PLAYER_COMMAND_NAMES.QUIT:
        quit(guildId);
        await interaction.reply('Goodbye!');
        break;
      default:
        await interaction.reply('Failed this miserably!');
        break;
    }
  },
};
