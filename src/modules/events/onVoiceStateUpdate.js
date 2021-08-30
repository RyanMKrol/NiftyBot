import { BOT_ID } from '../constants';
import GUILD_MANAGER_COLLECTION from '../model';

/**
 * Method to handle when the voice state changes in any discord server this bot is in
 *
 * @param {module:app.VoiceState} oldState The old voice state
 * @param {module:app.VoiceState} newState The new voice state
 */
async function onVoiceStateUpdate(oldState, newState) {
  const channels = newState.guild.channels.cache;
  const guildId = newState.guild.id;

  if (!isBotInVoiceChannel(channels)) {
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
    manager.updatePlayerDisconnected();
    manager.clearPlaylist();
  }
}

/**
 * Determine if the bot is still active in the channel
 *
 * @param {CategoryChannel} channels The channels in this guild
 * @returns {boolean} If the bot is active in a channel
 */
function isBotInVoiceChannel(channels) {
  let found = false;

  channels.forEach((channel) => {
    if (channel.type === 'voice') {
      channel.members.forEach((member, memberId) => {
        if (memberId === BOT_ID) {
          found = true;
        }
      });
    }
  });

  return found;
}

export default onVoiceStateUpdate;
