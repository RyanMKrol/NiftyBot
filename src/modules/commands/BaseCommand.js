/**
 * BaseCommand
 */
class BaseCommand {
  /**
   * constructor
   *
   * @param {Array<object>} patterns The patterns that will result in this command being run
   */
  constructor(patterns) {
    this.patterns = patterns;
  }

  /**
   * Fetch the patterns for parsing this command
   *
   * @returns {Array<string>} This command's patterns
   */
  getPatterns() {
    return this.patterns.map((pattern) => pattern.pattern);
  }

  /**
   * Fetch the patterns for displaying this command
   *
   * @returns {Array<string>} This command's patterns
   */
  getDisplayPatterns() {
    return this.patterns.map((pattern) => pattern.display);
  }
}

export default BaseCommand;
