import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of commands'),

  /**
   * Executes the command
   *
   * @param {object} interaction User interaction object
   */
  async execute(interaction) {
    await interaction.reply('Here are the commands!');
  },
};
