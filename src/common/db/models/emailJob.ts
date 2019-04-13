import {
  EmailJobStatus,
  EmailServiceProvider,
  enumToArray
} from '@common/enums';
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
}

export default model<IEmailJob>('EmailJob', emailJobSchema);
