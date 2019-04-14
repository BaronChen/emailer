import { createLogger, Logger, transports } from 'winston';

export const logger: Logger = createLogger({
  transports: [
    // colorize the output to the console
    new transports.Console({
      level: process.env.LOGGING_LEVEL || 'debug'
    })
  ]
});
