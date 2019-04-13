import { EventTypes } from '@common/events';
import { consumer } from '@lib/sqs';
import { emailJobCompletedHandler } from './emailJobCompletedHandler';
import { emailJobCreatedHandler } from './emailJobCreatedHandler';

export const confgiHandlers = () => {
  consumer.addEventHandler(EventTypes.EmailJobCreated, emailJobCreatedHandler);
  consumer.addEventHandler(
    EventTypes.EmailJobCompleted,
    emailJobCompletedHandler
  );
  consumer.startConsumer();
};
