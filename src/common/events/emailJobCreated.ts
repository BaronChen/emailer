import { IEventBase } from '@lib/sqs';
import { EventTypes } from './eventTypes';

export interface IEmailJobCreated extends IEventBase {
  eventType: EventTypes.EmailJobCreated;
}
