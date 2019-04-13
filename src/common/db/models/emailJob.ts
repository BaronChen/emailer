import { Document, model, Schema } from 'mongoose';
import { EmailJobStatus, EmailServiceProvider, enumToArray } from '../../enums';

const emailJobSchema = new Schema({
  fromAddress: String,
  toAddresses: [String],
  ccAddresses: [String],
  bccAddresses: [String],
  body: String,
  subject: String,
  content: String,
  modified: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  serviceUsed: {
    type: String,
    enum: enumToArray(EmailServiceProvider)
  },
  status: { type: String, enum: enumToArray(EmailJobStatus) }
});

export interface IEmailJob extends Document {
  fromAddress: string;
  toAddresses: string[];
  ccAddresses: string[];
  bccAddresses: string[];
  body: string;
  subject: string;
  content: string;
  modified: Date;
  created: Date;
  serviceToUse?: EmailServiceProvider;
  status: EmailJobStatus;
}

export default model<IEmailJob>('EmailJob', emailJobSchema);
