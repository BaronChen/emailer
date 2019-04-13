import { IEmailJobFailed } from '@common/events';
import { emailService } from '@common/services';

export const emailJobFaileddHandler = async (
  entityId: string,
  event: IEmailJobFailed
) => {
  await emailService.sendEmail(entityId);
};
