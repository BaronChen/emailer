import { connectMongo } from '@lib/mongo';
import { configSqs } from '@lib/sqs';
import { startApi } from './api';
import { confgiHandlers } from './messageProcessor';

connectMongo(process.env.MONGO_URL || 'mongodb://localhost:27017/emailer');
configSqs();

startApi();
confgiHandlers();
