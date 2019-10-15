import log4js from 'log4js';

log4js.configure({
  appenders: { out: { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'debug' } }
});

const logger = log4js.getLogger('out');

const debug = logger.debug.bind(logger);
const info = logger.info.bind(logger);
const warn = logger.warn.bind(logger);
const error = logger.error.bind(logger);

export {
  debug,
  info,
  warn,
  error,
};
