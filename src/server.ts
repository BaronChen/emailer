import { connectMongo } from '@lib/mongo';
import { startApi } from './api';

connectMongo(process.env.MONGO_URL || 'mongodb://localhost:27017/emailer');
startApi();
