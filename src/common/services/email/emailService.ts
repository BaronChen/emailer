import { emailJobRepository, IEmailJob } from '@common/db';
import { EmailJobStatus, EmailServiceProvider } from '@common/enums';
import { EventTypes } from '@common/events';
import { IEmailJobCreated } from '@common/events';
import { ApiError } from '@lib/api';
import { IMailGunPayload, mailGun } from '@lib/emailServiceProvider/';
import logger from '@lib/logger';
import { publisher } from '@lib/sqs';
import uuid = require('uuid');
import { getCurrentServiceProvider } from './emailServiceProviderSelector';
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

  const event: IEmailJobCreated = {
    entityId: id,
    eventId: uuid.v4(),
    eventType: EventTypes.EmailJobCreated
  };

  const success = await publisher.publishEvent(event);

  if (!success) {
    // TODO: Handle fail to publish event
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
    changedAt: result.modified
  };
};

export const completeEmailJob = async (
  emailJobReferenceId: string,
  serviceProviderUsed: EmailServiceProvider
) => {
  const job = await emailJobRepository.findById(emailJobReferenceId);
  job.serviceUsed = serviceProviderUsed;
  job.status = EmailJobStatus.Sent;
  await emailJobRepository.update(job);
  logger.info(
    `Email job ${job.id} completed with service provider ${serviceProviderUsed}`
  );
};

export const sendEmail = async (emailJobReferenceId: string): Promise<void> => {
  const job = await emailJobRepository.findById(emailJobReferenceId);
  let success = false;
  const serviceProvider = getCurrentServiceProvider();
  switch (serviceProvider) {
    case EmailServiceProvider.MailGun:
      success = await mailGun.sendEmailWithMailGun(getMailgGunPayLoad(job));
      break;
    case EmailServiceProvider.SendGrid:
      logger.info(`Not impletemnted yet`);
      break;
  }

  job.serviceUsed = serviceProvider;
  job.status = success ? EmailJobStatus.Sent : EmailJobStatus.Failed;
  await emailJobRepository.update(job);

  if (success) {
    logger.info(`Email sent for job ${job.id} with ${serviceProvider}`);
    await publisher.publishEvent({
      eventType: EventTypes.EmailJobCompleted,
      entityId: job.id,
      eventId: uuid.v4()
    });
  } else {
    logger.warning(
      `Email fail to sent for job ${job.id} with ${serviceProvider}`
    );
    await publisher.publishEvent({
      eventType: EventTypes.EmailJobFailed,
      entityId: job.id,
      eventId: uuid.v4()
    });
  }
};

const getMailgGunPayLoad = (job: IEmailJob): IMailGunPayload => {
  return {
    from: job.from,
    to: job.to.join(','),
    cc: job.cc.join(','),
    bcc: job.bcc.join(','),
    subject: job.subject,
    text: job.body
  };
};

export default {
  createEmailJob,
  queryJobStatus,
  sendEmail,
  completeEmailJob
};
