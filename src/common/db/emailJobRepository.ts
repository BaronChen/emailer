import { Types } from 'mongoose';
import { default as EmailJob, IEmailJob } from './models/emailJob';

const create = async (emailJob: IEmailJob): Promise<IEmailJob> => {
  return await EmailJob.create(emailJob);
};

const update = async (emailJob: IEmailJob): Promise<IEmailJob> => {
  emailJob.modified = new Date();
  return await EmailJob.updateOne({ _id: emailJob._id }, emailJob);
};

const findById = async (id: string): Promise<IEmailJob> => {
  return await EmailJob.findById({
    _id: Types.ObjectId.createFromHexString(id)
  });
};

export default { create, update, findById };
