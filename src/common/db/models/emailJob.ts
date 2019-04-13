import {
  EmailJobStatus,
  EmailServiceProvider,
  enumToArray
} from '@common/enums';
import { IMailGunPayload, ISendGridPayload } from '@lib/emailServiceProvider';
import { Document, model, Schema } from 'mongoose';

const emailJobSchema = new Schema({
  from: String,
  to: [String],
  cc: [String],
  bcc: [String],
  body: String,
  subject: String,
  modified: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  serviceUsed: {
    type: String,
    enum: [...enumToArray(EmailServiceProvider), null]
  },
  status: { type: String, enum: enumToArray(EmailJobStatus) }
});

emailJobSchema.methods.toMailGunPayload = function(): IMailGunPayload {
  return {
    from: this.from,
    to: formatMailGunArray(this.to),
    cc: formatMailGunArray(this.cc),
    bcc: formatMailGunArray(this.bcc),
    subject: this.subject,
    text: this.body
  };
};

emailJobSchema.methods.toSendGridPayload = function(): ISendGridPayload {
  return {
    from: { email: this.from },
    content: [
      {
        type: 'text/plain',
        value: this.body
      }
    ],
    personalizations: [
      {
        subject: this.subject,
        to: this.to.map(x => ({ email: x })),
        cc: formatSendGridArray(this.cc),
        bcc: formatSendGridArray(this.bcc)
      }
    ]
  };
};

const formatSendGridArray = (
  arr: string[]
): Array<{ email: string }> | undefined => {
  return arr != null && arr.length > 0
    ? arr.map(x => ({ email: x }))
    : undefined;
};

const formatMailGunArray = (arr: string[]): string | undefined => {
  return arr != null && arr.length > 0 ? arr.join(',') : undefined;
};

export interface IEmailJob extends Document {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  body: string;
  subject: string;
  modified: Date;
  created: Date;
  serviceUsed?: EmailServiceProvider;
  status: EmailJobStatus;
  toMailGunPayload: () => IMailGunPayload;
  toSendGridPayload: () => ISendGridPayload;
}

export default model<IEmailJob>('EmailJob', emailJobSchema);
