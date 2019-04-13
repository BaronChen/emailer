import { Request, Response } from 'express';
import uuid = require('uuid');

const createEmailJob = async (req: Request, res: Response) => {
  res.send(uuid.v4());
};

const queryEmailJobStatus = async (req: Request, res: Response) => {
  res.json({ status: 'failed' });
};

const contoller = {
  createEmailJob,
  queryEmailJobStatus
};

export default contoller;
