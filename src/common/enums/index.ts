export enum EmailServiceProvider {
  MailGun = 'MailGun',
  SendGrid = 'SendGrid'
}

export enum EmailJobStatus {
  Created = 'Created',
  Sent = 'Sent'
}

export const enumToArray = (e: any) => {
  return Object.keys(e).map(x => e[x]);
};
