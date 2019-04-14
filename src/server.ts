import { EmailServiceProvider } from '@common/enums';
import { EmailServiceProviderSelector } from '@common/services';
import { connectMongo } from '@lib/mongo';
import { configSqs } from '@lib/sqs';
import { startApi } from './api';
import { configMessageProcessors } from './messageProcessor';

connectMongo(process.env.MONGO_URL || 'mongodb://localhost:27017/emailer');
configSqs();

EmailServiceProviderSelector.initialiseFailOverConfig(
  EmailServiceProvider.SendGrid
);
startApi();

configMessageProcessors();
