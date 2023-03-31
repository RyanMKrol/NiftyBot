import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  VoiceState,
  createAudioResource,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';

import Player from './Player';
import Playlist from './Playlist';
import { logger } from '../logger';

/**
 * Model to manage the guild (server)
 */
export default class Guild {
  /**
   * Constructor
   *
   * @param {string} guildId The ID of the guild we're adding
   * @param {VoiceState} initialVoiceChannel The voice channel we start adding the connection to
   * @param {Function} onDone Callback to call once this guild has finished playing videos
   */
  constructor(guildId, initialVoiceChannel, onDone) {
    this.id = guildId;
    this.playlist = new Playlist();

    this.player = new Player();
    this.player.registerIdleEventHandler(() => this.playNextVideo());

    logger.debug('Joining voice channel and setting up connection');
    this.connection = joinVoiceChannel({
      channelId: initialVoiceChannel.id,
      guildId,
      adapterCreator: initialVoiceChannel.guild.voiceAdapterCreator,
    });
    this.connection.on(VoiceConnectionStatus.Ready, () => {
      logger.debug('Connection is ready to play video');
      this.player.registerSubscriber(this.connection);
    });

    this.onDone = onDone;
  }

  /**
   * Return the playlist
   *
   * @returns {Playlist} The playlist
   */
  getPlaylist() {
    return this.playlist;
  }

  /**
   * Return the player
   *
   * @returns {Player} The player
   */
  getPlayer() {
    return this.player;
  }

  /**
   * Return the ID
   *
   * @returns {string} The ID
   */
  getId() {
    return this.id;
  }

  /**
   * Ensure that the player is playing something in this guild
   */
  async ensurePlaying() {
    if (!this.player.isIdle()) {
      logger.debug('Player is already playing, doing nothing...');
    } else {
      logger.debug('Player was playing nothing, manually starting a video...');
      await this.playNextVideo();
    }
  }

  /**
   * Cleans up connections, and players
   */
  quit() {
    logger.debug('Performing guild cleanup tasks...');
    this.player.quit();
    this.connection.destroy();
  }

  /**
   * Ensures the player is playing by pulling a video from the playlist, and playing it
   */
  async playNextVideo() {
    if (this.playlist.isEmpty()) {
      logger.debug('The playlist is empty, time to clean everything up...');
      this.onDone();
    } else {
      logger.debug('Player is idle, pulling next video from the playlist...');
      const nextVideoUrl = this.playlist.next().link;

      logger.debug('Creating a stream from video with url:', nextVideoUrl);
      const rawStream = await ytdl(nextVideoUrl, {
        filter: 'audioonly',
      });
      const playerResource = createAudioResource(rawStream);

      logger.debug('Playing video...');
      this.player.play(playerResource);
    }
  }

  /**
   * Clear the remaining playlist
   */
  clearPlaylist() {
    this.playlist.clear();
  }

  /**
   * Get a string representation of the playlist
   *
   * @returns {string} String representation of the playlist
   */
  getPlaylistToString() {
    const MAX_TITLE_SIZE = 60;
    const MAX_LIST_SIZE = 10;

    const playlistItems = this.playlist.getPlaylist().slice(0, MAX_LIST_SIZE);

    if (playlistItems.length === 0) {
      return 'The playlist is empty!';
    }

    const output = playlistItems.reduce((acc, val, index) => {
      const title = val.title.length > MAX_TITLE_SIZE
        ? `${val.title.substring(0, MAX_TITLE_SIZE - 3)}...`
        : val.title;
      return `${acc}${index + 1}. ${title}\n`;
    }, '');

    return `Here's the current playlist:\n\`\`\`yaml\n${output}...\`\`\``;
  }
}
