import { emailJobRepository, IEmailJob } from '@common/db';
import { EmailJobStatus, EmailServiceProvider } from '@common/enums';
import { IEmailJobMessage, MessageTypes } from '@common/messages';
import { ApiError } from '@lib/api';
import { mailGun, sendGrid } from '@lib/emailServiceProvider/';
import logger from '@lib/logger';
import { publisher } from '@lib/sqs';
import uuid = require('uuid');
import {
  getCurrentServiceProvider,
  tryToFailOver
} from './emailServiceProviderSelector';
import {
  IEmailStatusQueryRequest,
  IEmailStatusQueryResponse,
  ISendEmailRequest,
  ISendEmailResponse
} from './interfaces';

export const createEmailJob = async (
  sendEmailRequest: ISendEmailRequest
): Promise<ISendEmailResponse> => {
  const now = new Date();
  const emailJob: IEmailJob = {
    ...sendEmailRequest,
    modified: now,
    created: now,
    serviceUsed: null,
    status: EmailJobStatus.Created
  } as IEmailJob;

  const result = await emailJobRepository.create(emailJob);
  const id = result._id.toString();

  const message: IEmailJobMessage = {
    entityId: id,
    messageId: uuid.v4(),
    messageType: MessageTypes.EmailJobMessage
  };

  const success = await publisher.publishMessage(message);

  if (!success) {
    // TODO: Handle fail to publish message
    throw new ApiError('Fail to process send email request');
  }

  return { referenceId: id };
};

export const queryJobStatus = async (
  jobStatusQueryStatus: IEmailStatusQueryRequest
): Promise<IEmailStatusQueryResponse> => {
  const result = await emailJobRepository.findById(
    jobStatusQueryStatus.referenceId
  );

  return {
    referenceId: result._id.toString(),
    status: result.status,
    updatedAt: result.modified,
    serviceProvider: result.serviceUsed
  };
};

export const sendEmail = async (emailJobReferenceId: string): Promise<void> => {
  const job = await emailJobRepository.findById(emailJobReferenceId);
  let success = false;
  const serviceProvider = getCurrentServiceProvider();
  logger.info(`Try to send email for job ${job.id} with ${serviceProvider}`);
  switch (serviceProvider) {
    case EmailServiceProvider.MailGun:
      success = await mailGun.sendEmailWithMailGun(job.toMailGunPayload());
      break;
    case EmailServiceProvider.SendGrid:
      success = await sendGrid.sendEmailWithSendGrid(job.toSendGridPayload());
      break;
    default:
      break;
  }

  job.serviceUsed = serviceProvider;
  job.status = success ? EmailJobStatus.Sent : EmailJobStatus.Failed;
  await emailJobRepository.update(job);

  if (success) {
    logger.info(`Email sent for job ${job.id} with ${serviceProvider}`);
  } else {
    logger.info(`Email fail to sent for job ${job.id} with ${serviceProvider}`);
    tryToFailOver(serviceProvider);
    await publisher.publishMessage({
      messageType: MessageTypes.EmailJobMessage,
      entityId: job.id,
      messageId: uuid.v4()
    } as IEmailJobMessage);
  }
};

export default {
  createEmailJob,
  queryJobStatus,
  sendEmail
};
