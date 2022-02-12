/** @module Model */

import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ytdl from 'ytdl-core';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * @typedef YTDL_Stream
 * @see https://www.npmjs.com/package/ytdl-core
 */

/**
 * Player
 */
class Player {
  /**
   * constructor
   *
   * @param {Function} onFinish Method to call after playing a song
   */
  constructor(onFinish) {
    this.connection = undefined;
    this.dispatcher = undefined;
    this.playing = false;
    this.paused = false;
    this.onFinish = onFinish;
  }

  /**
   * Add a link to the playlist
   *
   * @param {module:app.VoiceChannel} channel The voice channel to play in
   * @param {string} link the link to add to the playlist
   */
  play(channel, link) {
    this.playStream(channel, link);
  }

  /**
   * Disconnect the player from the channel
   */
  quit() {
    this.playing = false;
    this.connection.disconnect();
  }

  /**
   * Stop whatever the player is playing
   */
  pause() {
    if (this.paused) return;
    this.paused = true;

    this.dispatcher.pause();
  }

  /**
   * Resume whatever the player is playing
   */
  resume() {
    if (!this.paused) return;
    this.paused = false;

    // HACK: For some reason, the resume method on the StreamDispatcher object doesn't work
    // until you pause the content, and resume it again. You can find details here:
    // https://github.com/discordjs/discord.js/issues/5300
    this.dispatcher.resume();
    this.dispatcher.pause();
    this.dispatcher.resume();
  }

  /**
   * Return if the player is playing
   *
   * @returns {boolean} Whether the player is playing
   */
  isPlaying() {
    return this.playing;
  }

  /**
   * Informs the player that it's been disconnected
   */
  setDisconnectedState() {
    this.playing = false;
  }

  /**
   * Play a stream in the specified voice channel
   *
   * @param {module:app.VoiceChannel} channel The channel to play in
   * @param {string} link A link to the content to play
   */
  async playStream(channel, link) {
    const stream = ytdl(link, { filter: 'audioonly' });

    checkIfStreamPlayable(stream)
      .then((playableStream) => {
        this.joinChannelAndStream(channel, playableStream);
      })
      .catch(() => {
        this.onFinish();
      });
  }

  /**
   * Join the channel and start streaming audio
   *
   * @param {module:app.VoiceChannel} channel The voice channel to play in
   * @param {stream.PassThrough} stream The data we want to stream to our channel
   */
  joinChannelAndStream(channel, stream) {
    channel.join().then(async (connection) => {
      this.connection = connection;
      this.playing = true;
      this.paused = false;

      this.dispatcher = await this.connection.play(stream);

      this.dispatcher.on('finish', async () => {
        this.playing = false;
        this.onFinish();
      });
    });
  }
}

/**
 * Check if the user's stream is playable
 *
 * @param {YTDL_Stream} stream The stream created from ytdl download
 * @returns {Promise.<stream> | null} The stream to play, or nothing
 */
async function checkIfStreamPlayable(stream) {
  return new Promise((resolve, reject) => {
    const download = ffmpeg(stream)
      .audioBitrate(96)
      .format('mp3');

    const verifiedDownload = download
      .on('error', () => {
        reject();
      })
      .on('codecData', () => {
        resolve(verifiedDownload);
      })
      .pipe();
  });
}

export default Player;
