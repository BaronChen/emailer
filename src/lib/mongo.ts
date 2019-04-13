import { connect } from 'mongoose';
import logger from './logger';

export const connectMongo = (connectionString: string) => {
  connect(
    connectionString,
    { useNewUrlParser: true },
    err => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(`Connected to mongo at ${connectionString}`);
      }
    }
  );
};
