import { logger } from '@lib/logger';
import { OptionsWithUri, post } from 'request-promise-native';

const url = process.env.SENDGRID_URL || 'https://api.sendgrid.com/v3/mail/send';
const sendGridApiKey =
  process.env.SENDGRID_API_KEY ||
  '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';

export interface ISendGridPayload {
  personalizations: [
    {
      to: Array<{ email: string }>;
      cc: Array<{ email: string }>;
      bcc: Array<{ email: string }>;
      subject: string;
    }
  ];
  from: {
    email: string;
  };
  content: Array<{
    type: string;
    value: string;
  }>;
}

const sendEmailWithSendGrid = async (payload: ISendGridPayload) => {
  const options: OptionsWithUri = {
    method: 'POST',
    uri: url,
    body: payload,
    json: true,
    headers: {
      Authorization: `Bearer ${sendGridApiKey}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    // this is a manul trigger for failover for demostration purpose
    if (payload.personalizations[0].subject === 'sendgrid-down') {
      throw new Error('error to trigger failover');
    }
    await post(options);
    return true;
  } catch (err) {
    logger.error(`Fail to send mail using SendGrid with err: `, err);
    return false;
  }
};

export const SendGrid = {
  sendEmailWithSendGrid
};
