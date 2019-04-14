import { logger } from '@lib/logger';
import { OptionsWithUri, post } from 'request-promise-native';

const url =
  process.env.MAILGUN_URL || 'https://api.mailgun.net/v3/technerd.me/messages';
const mailGunApiKey =
  process.env.MAILGUN_API_KEY ||
  'e8b9f62d4276d0a8e23010b6bd523a37-6140bac2-192b688f';

export interface IMailGunPayload {
  from: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  text: string;
}

const sendEmailWithMailGun = async (payload: IMailGunPayload) => {
  const options: OptionsWithUri = {
    method: 'POST',
    uri: url,
    form: payload,
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${mailGunApiKey}`).toString(
        'base64'
      )}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  try {
    // this is a manul trigger for failover for demostration purpose
    if (payload.subject === 'mailgun-down') {
      throw new Error('error to trigger failover');
    }
    await post(options);
    return true;
  } catch (err) {
    logger.error(`Fail to send mail using MailGun with err: `, err);
    return false;
  }
};

export const MailGun = {
  sendEmailWithMailGun
};
