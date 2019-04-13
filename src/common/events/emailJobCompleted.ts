import { EmailServiceProvider } from '@common/enums';
import { IEventBase } from '@lib/sqs';
import { EventTypes } from './eventTypes';

export interface IEmailJobCompleted {
  eventType: EventTypes.EmailJobCompleted;
  serviceProviderUsed: EmailServiceProvider;
}
