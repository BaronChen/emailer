import { IEmailJobCompleted } from '@common/events';
import { emailService } from '@common/services';

export const emailJobCompletedHandler = async (
  entityId: string,
  event: IEmailJobCompleted
) => {
  await emailService.completeEmailJob(entityId, event.serviceProviderUsed);
};
