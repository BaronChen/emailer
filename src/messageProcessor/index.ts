import { MessageTypes } from '@common/messages';
import { consumer } from '@lib/sqs';
import { emailJobMessageProcessor } from './emailJobMessageProcessor';

export const confgiHandlers = () => {
  consumer.addMessageProcessor(
    MessageTypes.EmailJobMessage,
    emailJobMessageProcessor
  );
  consumer.startConsumer();
};
