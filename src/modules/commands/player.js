import { SlashCommandBuilder } from 'discord.js';

const PLAYER_COMMAND_NAMES = {
  PAUSE: 'pause',
  RESUME: 'resume',
  SKIP: 'skip',
  CLEAR: 'clear',
  LIST: 'list',
  QUIT: 'quit',
};

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
      .setName(PLAYER_COMMAND_NAMES.QUIT)
      .setDescription('Removes the player from voice chat')),

  /**
   * Executes the command
   *
   * @param {object} interaction User interaction object
   */
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case PLAYER_COMMAND_NAMES.PAUSE:
        await interaction.reply(PLAYER_COMMAND_NAMES.PAUSE);
        break;
      case PLAYER_COMMAND_NAMES.RESUME:
        await interaction.reply(PLAYER_COMMAND_NAMES.RESUME);
        break;
      case PLAYER_COMMAND_NAMES.SKIP:
        await interaction.reply(PLAYER_COMMAND_NAMES.SKIP);
        break;
      case PLAYER_COMMAND_NAMES.CLEAR:
        await interaction.reply(PLAYER_COMMAND_NAMES.CLEAR);
        break;
      case PLAYER_COMMAND_NAMES.LIST:
        await interaction.reply(PLAYER_COMMAND_NAMES.LIST);
        break;
      case PLAYER_COMMAND_NAMES.QUIT:
        await interaction.reply(PLAYER_COMMAND_NAMES.QUIT);
        break;
      default:
        await interaction.reply('Failed this miserably!');
        break;
    }
  },
};
