import { EmailServiceProvider, enumToArray } from '@common/enums';
import logger from '@lib/logger';

const FAILOVER_THRESHOLD = process.env.FAILOVER_THRESHOLD || 3;

// TODO: store these variable to redis or database to improve multi instance performance
let currentServiceProvider = EmailServiceProvider.SendGrid;
let failedCounter = 0;

export const getCurrentServiceProvider = () => {
  return currentServiceProvider;
};

export const recordFailureForServiceProvider = (
  failedServiceProvider: EmailServiceProvider
) => {
  if (failedServiceProvider !== currentServiceProvider) {
    return;
  }

  failedCounter++;

  if (failedCounter > FAILOVER_THRESHOLD) {
    currentServiceProvider = getFailOverProvider(failedServiceProvider);
    failedCounter = 0;
  }
};

const getFailOverProvider = (
  failedProvider: EmailServiceProvider
): EmailServiceProvider => {
  const providers = enumToArray(EmailServiceProvider);
  let i = providers.indexOf(failedProvider) + 1;
  if (i >= providers.length) {
    i = 0;
  }
  logger.error(`Fail over to ${providers[i]}`);
  return providers[i];
};
