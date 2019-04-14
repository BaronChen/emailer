import { EmailServiceProvider } from '@common/enums';
import * as loggerModule from '@lib/logger';
import { expect } from 'chai';
import { stub } from 'sinon';
import {
  EmailServiceProviderSelector,
  FAILOVER_THRESHOLD
} from './emailServiceProviderSelector';

describe('emailServiceProviderSelector', () => {
  beforeEach(() => {
    EmailServiceProviderSelector.initialiseFailOverConfig(
      EmailServiceProvider.SendGrid
    );
    stub(loggerModule, 'logger').callsFake(() => ({
      error: () => {},
      info: () => {}
    }));
  });

  it('should initialise default service provider', () => {
    EmailServiceProviderSelector.initialiseFailOverConfig(
      EmailServiceProvider.MailGun
    );

    expect(EmailServiceProviderSelector.getCurrentServiceProvider()).to.equal(
      EmailServiceProvider.MailGun
    );
  });

  it('should not increase failure counter when failed provider is not the current one', () => {
    const currentProvider = EmailServiceProviderSelector.getCurrentServiceProvider();

    const currentFailedCounter = EmailServiceProviderSelector.getCurrentFailedCounter();
    const failedProvider =
      currentProvider === EmailServiceProvider.MailGun
        ? EmailServiceProvider.SendGrid
        : EmailServiceProvider.MailGun;

    EmailServiceProviderSelector.recordFailureForServiceProvider(
      failedProvider
    );

    expect(EmailServiceProviderSelector.getCurrentFailedCounter()).to.equal(
      currentFailedCounter
    );
  });

  it('should fail over when failure counter exceed threshold', () => {
    const currentProvider = EmailServiceProviderSelector.getCurrentServiceProvider();
    for (let index = 1; index <= (FAILOVER_THRESHOLD as number) + 1; index++) {
      EmailServiceProviderSelector.recordFailureForServiceProvider(
        currentProvider
      );
    }

    expect(
      EmailServiceProviderSelector.getCurrentServiceProvider()
    ).not.to.equal(currentProvider);

    expect(EmailServiceProviderSelector.getCurrentFailedCounter()).to.equal(0);
  });
});
