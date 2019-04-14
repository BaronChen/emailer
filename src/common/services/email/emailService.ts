import { EmailJobRepository, IEmailJob } from '@common/db';
import { EmailJobStatus, EmailServiceProvider } from '@common/enums';
import { IEmailJobMessage, MessageTypes } from '@common/messages';
import { MailGun, SendGrid } from '@lib/emailServiceProvider/';
import { logger } from '@lib/logger';
import { Publisher } from '@lib/sqs';
import * as uuid from 'uuid';
import { EmailServiceProviderSelector } from './emailServiceProviderSelector';
import {
  IEmailStatusQueryRequest,
  IEmailStatusQueryResponse,
  ISendEmailRequest,
  ISendEmailResponse
} from './interfaces';

const createEmailJob = async (
  sendEmailRequest: ISendEmailRequest
): Promise<ISendEmailResponse> => {
  const now = new Date();
  const emailJob: IEmailJob = {
    ...sendEmailRequest,
    modified: now,
    created: now,
    serviceUsed: null,
    status: EmailJobStatus.Created,
    retryCount: 0
  } as IEmailJob;

  const result = await EmailJobRepository.create(emailJob);
  const id = result._id.toString();

  const message: IEmailJobMessage = {
    entityId: id,
    messageId: uuid.v4(),
    messageType: MessageTypes.EmailJobMessage
  };

  const success = await Publisher.publishMessage(message);

  if (!success) {
    // TODO: Handle fail to publish message
    throw new Error('Fail to process send email request');
  }

  return { referenceId: id };
};

const queryJobStatus = async (
  jobStatusQueryStatus: IEmailStatusQueryRequest
): Promise<IEmailStatusQueryResponse> => {
  const result = await EmailJobRepository.findById(
    jobStatusQueryStatus.referenceId
  );

  if (!result) {
    return null;
  }

  return {
    referenceId: result._id.toString(),
    status: result.status,
    updatedAt: result.modified,
    serviceProvider: result.serviceUsed,
    retryCount: result.retryCount
  };
};

const sendEmail = async (emailJobReferenceId: string): Promise<void> => {
  const job = await EmailJobRepository.findById(emailJobReferenceId);
  let success = false;
  const serviceProvider = EmailServiceProviderSelector.getCurrentServiceProvider();
  logger.info(`Try to send email for job ${job.id} with ${serviceProvider}`);
  switch (serviceProvider) {
    case EmailServiceProvider.MailGun:
      success = await MailGun.sendEmailWithMailGun(job.toMailGunPayload());
      break;
    case EmailServiceProvider.SendGrid:
      success = await SendGrid.sendEmailWithSendGrid(job.toSendGridPayload());
      break;
    default:
      break;
  }

  job.serviceUsed = serviceProvider;
  job.status = success ? EmailJobStatus.Sent : EmailJobStatus.Failed;
  if (!success) {
    job.retryCount++;
  }
  await EmailJobRepository.update(job);

  if (success) {
    logger.info(`Email sent for job ${job.id} with ${serviceProvider}`);
  } else {
    logger.info(`Email fail to sent for job ${job.id} with ${serviceProvider}`);
    EmailServiceProviderSelector.recordFailureForServiceProvider(
      serviceProvider
    );
    await Publisher.publishMessage({
      messageType: MessageTypes.EmailJobMessage,
      entityId: job.id,
      messageId: uuid.v4()
    } as IEmailJobMessage);
    logger.info(`Reschedule email for job ${job.id}`);
  }
};

export const EmailService = {
  createEmailJob,
  queryJobStatus,
  sendEmail
};
