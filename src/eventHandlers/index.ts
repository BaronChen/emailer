import { EventTypes } from '@common/events/eventTypes';
import { consumer } from '@lib/sqs';
import { emailJobCreatedHandler } from './emailJobCreatedHandler';

export const confgiHandlers = () => {
  consumer.addEventHandler(EventTypes.EmailJobCreated, emailJobCreatedHandler);
  consumer.startConsumer();
};
