import { IEmailJobCreated } from '@common/events';
import { emailService } from '@common/services';

export const emailJobCreatedHandler = async (
  entityId: string,
  event: IEmailJobCreated
) => {
  await emailService.sendEmail(entityId);
};
