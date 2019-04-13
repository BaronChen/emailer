import { ApiError, errorHanlder } from '@lib/api';
import * as express from 'express';
import emailRouter from './email/router';

const app: express.Express = express();
const port = process.env.SERVER_PORT || 8888;

export const startApi = () => {
  app.use(express.json());
  app.use('/emailJob', emailRouter);

  app.get(
    '*',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const err = new ApiError('Not Found');
      err.statusCode = 404;
      next(err);
    }
  );

  app.use(errorHanlder);

  app.listen(port, () => console.log(`Server running on ${port}...`));
};
