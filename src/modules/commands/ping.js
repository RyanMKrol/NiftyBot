import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addSubcommand((subcommand) => subcommand
      .setName('link')
      .setDescription('A link to use')
      .addStringOption((option) => option.setName('link')
        .setDescription('The input to echo back')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('search')
      .setDescription('Terms to search for')
      .addStringOption((option) => option.setName('search_terms')
        .setDescription('The input to echo back')
        .setRequired(true))),

  /**
   * Executes the command
   *
   * @param {object} interaction User interaction object
   */
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
