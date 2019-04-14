import { MessageTypes } from '@common/messages';
import { Consumer } from '@lib/sqs';
import { emailJobMessageProcessor } from './emailJobMessageProcessor';

export const configMessageProcessors = () => {
  Consumer.addMessageProcessor(
    MessageTypes.EmailJobMessage,
    emailJobMessageProcessor
  );
  Consumer.startConsumer();
};
