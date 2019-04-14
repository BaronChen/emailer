import { logger } from '@lib/logger';
import { SinonStub, stub } from 'sinon';

beforeEach(() => {
  stub(logger, 'error').returns(null);
  stub(logger, 'info').returns(null);
});

afterEach(() => {
  (logger.error as SinonStub).restore();
  (logger.info as SinonStub).restore();
});
