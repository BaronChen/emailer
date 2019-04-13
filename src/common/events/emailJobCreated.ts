import { EventTypes } from './eventTypes';

export interface IEmailJobCreated {
  eventType: EventTypes.EmailJobCreated;
  entityId: string;
  eventId: string;
  serviceToUse: string;
}
