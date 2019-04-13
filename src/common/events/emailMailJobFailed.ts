import { IEventBase } from '@lib/sqs';
import { EventTypes } from './eventTypes';

export interface IEmailJobFailed extends IEventBase {
  eventType: EventTypes.EmailJobFailed;
}
