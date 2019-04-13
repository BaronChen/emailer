import { EmailJobStatus, EmailServiceProvider } from '@common/enums';
import { IEmailJobCreated } from '@common/events';
import { EventTypes } from '@common/events/eventTypes';
import { ApiError } from '@lib/api';
import { publisher } from '@lib/sqs';
import uuid = require('uuid');
import { emailJobRepository, IEmailJob } from '../../db';
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
    serviceToUse: null,
    status: EmailJobStatus.Created
  } as IEmailJob;

  const result = await emailJobRepository.create(emailJob);
  const id = result._id.toString();

  const event: IEmailJobCreated = {
    entityId: id,
    eventId: uuid.v4(),
    eventType: EventTypes.EmailJobCreated,
    serviceToUse: EmailServiceProvider.MailGun
  };

  const success = await publisher.publishEvent(id, event, event.eventType);

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

export default {
  createEmailJob,
  queryJobStatus
};
