import { EventTypes } from '@common/events';

export interface IEventBase {
  eventType: EventTypes;
  entityId: string;
  eventId: string;
}
