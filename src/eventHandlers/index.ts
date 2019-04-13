import { EventTypes } from '@common/events';
import { consumer } from '@lib/sqs';
import { emailJobCompletedHandler } from './emailJobCompletedHandler';
import { emailJobCreatedHandler } from './emailJobCreatedHandler';
import { emailJobFaileddHandler } from './emailJobFailedHandler';

export const confgiHandlers = () => {
  consumer.addEventHandler(EventTypes.EmailJobCreated, emailJobCreatedHandler);
  consumer.addEventHandler(
    EventTypes.EmailJobCompleted,
    emailJobCompletedHandler
  );
  consumer.addEventHandler(EventTypes.EmailJobFailed, emailJobFaileddHandler);
  consumer.startConsumer();
};
