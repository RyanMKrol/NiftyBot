import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ytdl from 'ytdl-core';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * @typedef YTDL_Stream
 * @see https://www.npmjs.com/package/ytdl-core
 */

/**
 * @typedef Stream
 * @see https://nodejs.org/api/stream.html
 */

/**
 * A model for the Player
 */
class Player {
  /**
   * Constructor
   *
   * @param {Function} onFinish Method to call after playing a song
   */
  constructor(onFinish) {
    this.connection = undefined;
    this.playing = false;
    this.onFinish = onFinish;
  }

  /**
   * Add a link to the playlist
   *
   * @param channel
   * @param {string} link the link to add to the playlist
   */
  play(channel, link) {
    this.playStream(channel, link);
  }

  /**
   * Stop whatever the player is playing
   */
  stop() {
    console.log(this.connection);
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
   * Play a stream in the specified voice channel
   *
   * @param {string} channel The channel to play in
   * @param {string} link A link to the content to play
   */
  async playStream(channel, link) {
    const stream = ytdl(link, { filter: 'audioonly' });

    return checkIfStreamPlayable(stream)
      .then((playableStream) => {
        this.joinChannelAndStream(channel, playableStream);
      })
      .catch((error) => {
        console.log('error playing video');
        console.log(error);
      });
  }

  /**
   * Method to join the channel and start streaming audio
   *
   * @param {module:app.VoiceChannel} channel The voice channel to play in
   * @param {module:app.PassThrough} stream The data we want to stream to our channel
   */
  joinChannelAndStream(channel, stream) {
    channel.join().then(async (connection) => {
      this.connection = connection;
      this.playing = true;
      console.log(this.connection);
      const dispatcher = await this.connection.play(stream);

      dispatcher.on('finish', async () => {
        console.log('finished playing this');
        this.playing = false;
        this.onFinish();
      });
    });
  }
}

/**
 * Method to check if the user's stream is playable
 *
 * @param {YTDL_Stream} stream The stream created from ytdl download
 * @returns {Promise.<Stream> | null} The stream to play, or nothing
 */
async function checkIfStreamPlayable(stream) {
  return new Promise((resolve, reject) => {
    const download = ffmpeg(stream)
      .audioBitrate(48)
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
