import { EmailJobStatus, EmailServiceProvider } from '@common/enums';
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
    serviceToUse: EmailServiceProvider.MailGun,
    status: EmailJobStatus.Created
  } as IEmailJob;

  const result = await emailJobRepository.create(emailJob);

  return { referenceId: result._id.toString() };
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
