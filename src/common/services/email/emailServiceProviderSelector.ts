import { EmailServiceProvider } from '@common/enums';

const FAILOVER_THRESHOLD = process.env.FAILOVER_THRESHOLD || 3;

// TODO: store these variable to redis or database to improve multi instance performance
let currentServiceProvider = EmailServiceProvider.MailGun;
let failedCounter = 0;

export const getCurrentServiceProvider = () => {
  return currentServiceProvider;
};

export const tryToFailOver = (failedServiceProvider: EmailServiceProvider) => {
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
  // TODO: implement round robin algorithm to select fail over provider
  if (failedProvider === EmailServiceProvider.MailGun) {
    return EmailServiceProvider.SendGrid;
  } else {
    return EmailServiceProvider.MailGun;
  }
};
