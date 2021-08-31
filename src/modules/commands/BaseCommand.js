/**
 * BaseCommand
 */
class BaseCommand {
  /**
   * constructor
   *
   * @param {Array<string>} patterns The patterns that will result in this command being run
   */
  constructor(patterns) {
    this.patterns = patterns;
  }

  /**
   * Fetch the patterns for this command
   *
   * @returns {Array<string>} This command's patterns
   */
  getPatterns() {
    return this.patterns;
  }
}

export default BaseCommand;
