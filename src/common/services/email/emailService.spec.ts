import { EmailJobRepository, IEmailJob } from '@common/db';
import { EmailJob } from '@common/db/models/emailJob';
import { EmailJobStatus, EmailServiceProvider } from '@common/enums';
import { MessageTypes } from '@common/messages';
import { MailGun, SendGrid } from '@lib/emailServiceProvider';
import { Publisher } from '@lib/sqs';
import { Types } from 'mongoose';
import { assert, match, sandbox, SinonStub } from 'sinon';
import { EmailService } from './emailService';
import { EmailServiceProviderSelector } from './emailServiceProviderSelector';

describe('emailService', () => {
  describe('sendEmail', () => {
    const testId = '5cb29f9888052331742ae39d';
    const stubSandbox = sandbox.create();
    beforeEach(() => {
      EmailServiceProviderSelector.initialiseFailOverConfig(
        EmailServiceProvider.SendGrid
      );
      const testJob: IEmailJob = new EmailJob({
        _id: Types.ObjectId.createFromHexString(testId),
        to: ['test@test.com'],
        cc: [],
        bcc: ['test2@test.com'],
        from: 'test1@test.com',
        body: 'test body',
        subject: 'test subject',
        modified: new Date(),
        created: new Date(),
        serviceUsed: null,
        status: EmailJobStatus.Created,
        retryCount: 0
      });
      stubSandbox.stub(EmailJobRepository, 'findById').resolves(testJob);
    });

    afterEach(() => {
      stubSandbox.restore();
    });

    const serviceProviderTheories = [
      { input: EmailServiceProvider.MailGun },
      { input: EmailServiceProvider.SendGrid }
    ];

    serviceProviderTheories.forEach(({ input }) => {
      it(`should call service provider to send email and save job base on input ${input}`, async () => {
        stubSandbox.stub(EmailJobRepository, 'update').resolves();
        stubSandbox
          .stub(EmailServiceProviderSelector, 'getCurrentServiceProvider')
          .returns(input);
        stubSandbox.stub(MailGun, 'sendEmailWithMailGun').resolves(true);
        stubSandbox.stub(SendGrid, 'sendEmailWithSendGrid').resolves(true);

        await EmailService.sendEmail('testId');

        assert.calledWith(
          EmailJobRepository.update as SinonStub,
          match({
            serviceUsed: input,
            status: EmailJobStatus.Sent,
            retryCount: 0
          })
        );
      });
    });

    it(`Should reschedule job when failed`, async () => {
      const serviceProvider = EmailServiceProvider.SendGrid;
      stubSandbox.stub(EmailJobRepository, 'update').resolves();
      stubSandbox
        .stub(EmailServiceProviderSelector, 'getCurrentServiceProvider')
        .returns(serviceProvider);
      stubSandbox.stub(SendGrid, 'sendEmailWithSendGrid').resolves(false);
      stubSandbox.stub(Publisher, 'publishMessage').resolves(true);
      stubSandbox.stub(
        EmailServiceProviderSelector,
        'recordFailureForServiceProvider'
      );

      await EmailService.sendEmail('testId');

      assert.calledWith(
        EmailJobRepository.update as SinonStub,
        match({
          serviceUsed: serviceProvider,
          status: EmailJobStatus.Failed,
          retryCount: 1
        })
      );
      assert.calledWith(
        EmailServiceProviderSelector.recordFailureForServiceProvider as SinonStub,
        EmailServiceProvider.SendGrid
      );
      assert.calledWith(
        Publisher.publishMessage as SinonStub,
        match({
          messageType: MessageTypes.EmailJobMessage,
          entityId: testId
        })
      );
    });
  });
});
