import { EmailJobStatus, EmailServiceProvider } from '@common/enums';

export interface ISendEmailRequest {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  body: string;
  subject: string;
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
  updatedAt: Date;
  serviceProvider: EmailServiceProvider;
}
