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
    this.player.registerIdleEventHandler(() => this.ensurePlayingCallback());

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
      await this.ensurePlayingCallback();
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
  async ensurePlayingCallback() {
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
}
