import { EmailJobStatus } from '@common/enums';

export interface ISendEmailRequest {
  fromAddress: string;
  toAddresses: string[];
  ccAddresses: string[];
  bccAddresses: string[];
  body: string;
  subject: string;
  content: string;
}

export interface ISendEmailResponse {
  referenceId: string;
}

export interface IEmailStatusQueryRequest {
  referenceId: string;
}

export interface IEmailStatusQueryResponse {
  referenceId: string;
  status: EmailJobStatus;
  changedAt: Date;
}
