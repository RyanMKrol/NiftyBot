/**
 * Error to capture videos that are not available
 */
export default class YoutubeVideoUnavailable extends Error {
  /**
   * Constructor
   *
   * @param {...any} args Args to pipe to Error base class
   */
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, YoutubeVideoUnavailable);
  }
}
