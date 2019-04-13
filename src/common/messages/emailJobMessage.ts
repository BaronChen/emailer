import { IMessageBase } from '@lib/sqs';
import { MessageTypes } from './MessageType';

export interface IEmailJobMessage extends IMessageBase {
  messageType: MessageTypes.EmailJobMessage;
}
