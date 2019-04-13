import { config } from 'aws-sdk';

export const configSqs = () => {
  config.loadFromPath('./sqs-credential');
};
