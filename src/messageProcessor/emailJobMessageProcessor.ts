import { IEmailJobMessage } from '@common/messages';
import { emailService } from '@common/services';

export const emailJobMessageProcessor = async (
  entityId: string,
  message: IEmailJobMessage
) => {
  await emailService.sendEmail(entityId);
};
