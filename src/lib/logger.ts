import { createLogger, Logger, transports } from 'winston';

const logger: Logger = createLogger({
  transports: [
    // colorize the output to the console
    new transports.Console({
      level: process.env.LOGGING_LEVEL || 'debug'
    })
  ]
});

export default logger;
