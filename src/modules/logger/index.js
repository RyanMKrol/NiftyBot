const debug = require('debug');

/**
 * Create a logger at runtime
 *
 * @param {string} namespace The namespace of the logger
 * @returns {debug} A debug logger
 */
const createLogger = (namespace) => debug(`NiftyBot:${namespace}`);

const logger = {
  debug: createLogger('debug'), error: createLogger('error'),
};

export {
  logger,
  createLogger,
};
