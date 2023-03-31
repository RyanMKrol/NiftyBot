/**
 * Error to capture links that do not point to YouTube
 */
export default class InvalidYoutubeLink extends Error {
  /**
   * Constructor
   *
   * @param {...any} args Args to pipe to Error base class
   */
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InvalidYoutubeLink);
  }
}
