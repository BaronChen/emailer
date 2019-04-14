import { IEmailJobMessage } from '@common/messages';
import { EmailService } from '@common/services';

export const emailJobMessageProcessor = async (
  entityId: string,
  message: IEmailJobMessage
) => {
  await EmailService.sendEmail(entityId);
};
