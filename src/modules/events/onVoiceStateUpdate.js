import { BOT_USER_ID } from '../constants';
import { GUILD_MANAGER_COLLECTION } from '../model';
import convertMapToMap from '../utils';

/**
 * Method to handle when the voice state changes in any discord server this bot is in
 *
 * @param {module:app.VoiceState} oldState The old voice state
 * @param {module:app.VoiceState} newState The new voice state
 */
async function onVoiceStateUpdate(oldState, newState) {
  const channels = convertMapToMap(newState.guild.channels.cache);
  const guildId = newState.guild.id;
  const channelsMembers = getVoiceChannelsMembers(channels);

  // updates the state of the bot if it gets disconnected from a voice channel
  if (!isBotInVoiceChannel(channelsMembers)) {
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
    manager.updatePlayerDisconnected();
    manager.clearPlaylist();
  } else if (isOnlyBotInVoiceChannel(channelsMembers)) {
    const manager = await GUILD_MANAGER_COLLECTION.getManager(guildId);
    manager.quit();
  }
}

/**
 * Determine if the bot is still active in the channel
 *
 * @param {Array<Array<string>>} channelsMembers The members in each channel
 * @returns {boolean} If the bot is active in a channel
 */
function isBotInVoiceChannel(channelsMembers) {
  for (let i = 0; i < channelsMembers.length; i += 1) {
    if (channelsMembers[i].filter((id) => id === BOT_USER_ID).length === 1) {
      return true;
    }
  }

  return false;
}

/**
 * Determine if only the bot is in a voice channel
 *
 * @param {Array<Array<string>>} channelsMembers The members in each channel
 * @returns {boolean} If the bot is the only user active in a channel
 */
function isOnlyBotInVoiceChannel(channelsMembers) {
  for (let i = 0; i < channelsMembers.length; i += 1) {
    if (
      channelsMembers[i].length > 0
      && channelsMembers[i].length === channelsMembers[i].filter((id) => id === BOT_USER_ID).length
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Parses the current members in each voice channel
 *
 * @param {Map<JSON>} channels Channels to pull the members from
 * @returns {Array<Array<string>>} The members in each channel
 *
 * Output looks like:
 * [
 *  [1,2,3],
 *  [4,5]
 * ]
 */
function getVoiceChannelsMembers(channels) {
  const voiceChannels = Object.values(channels).filter((channel) => channel.type === 'voice');
  // a list where each object is a dictionary of users currently in the channel
  const channelsMembers = voiceChannels
    .map((channel) => convertMapToMap(channel.members))
    .map((members) => Object.keys(members));

  return channelsMembers;
}

export default onVoiceStateUpdate;
