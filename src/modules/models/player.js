import {
  AudioPlayerStatus,
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioResource,
} from '@discordjs/voice';
import { logger, createLogger } from '../logger';

const playerLogger = createLogger('player');

/**
 * Model to manage the underlying player, plus the current playlist of content to play
 */
export default class Player {
  /**
   * Constructor
   */
  constructor() {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    player.on(AudioPlayerStatus.Idle, () => {
      playerLogger('Player Status: Idle!');
    });
    player.on(AudioPlayerStatus.Buffering, () => {
      playerLogger('Player Status: Buffering!');
    });
    player.on(AudioPlayerStatus.AutoPaused, () => {
      playerLogger('Player Status: AutoPaused!');
    });
    player.on(AudioPlayerStatus.Playing, () => {
      playerLogger('Player Status: Playing!');
    });
    player.on(AudioPlayerStatus.Paused, () => {
      playerLogger('Player Status: Paused!');
    });
    player.on('error', (error) => {
      logger.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    });

    this.player = player;
  }

  /**
   * Start playing a given resource
   *
   * @param {AudioResource} resource The resource to play
   */
  async play(resource) {
    playerLogger('Playing...');
    this.player.play(resource);
  }

  /**
   * Pause playback on the player
   */
  async pause() {
    playerLogger('Pausing...');
    this.player.pause();
  }

  /**
   * Resume playback on the player
   */
  async resume() {
    playerLogger('Unpausing...');
    this.player.unpause();
  }

  /**
   * Removes the player from the server
   */
  async quit() {
    playerLogger('Quitting...');
    this.player.stop();
  }

  /**
   * Register subscriber with player
   *
   * @param {VoiceConnection} connection The connection to register
   */
  async registerSubscriber(connection) {
    playerLogger('Registering Subscriber...');
    connection.subscribe(this.player);
  }
}
