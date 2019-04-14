import { logger } from '@lib/logger';
import { SQS } from 'aws-sdk';
import { Consumer as SqsConsumer } from 'sqs-consumer';

const queueUrl =
  process.env.SQS_URL ||
  'https://sqs.ap-southeast-2.amazonaws.com/677611292116/emailer-message-queue.fifo';

interface IMessageProcessorRegistry {
  [messageType: string]: (entityId: string, message: any) => Promise<void>;
}

const messageProcessors: IMessageProcessorRegistry = {};

const addMessageProcessor = <T>(
  messageType: string,
  processor: (entityId: string, payload: T) => Promise<void>
) => {
  messageProcessors[messageType] = processor;
};

const startConsumer = () => {
  const consumer: SqsConsumer = SqsConsumer.create({
    queueUrl,
    sqs: new SQS(),
    messageAttributeNames: ['EntityId', 'MessageType'],
    handleMessage: async (message: SQS.Message) => {
      const messageType = message.MessageAttributes.MessageType.StringValue;
      const entityId = message.MessageAttributes.EntityId.StringValue;
      logger.info(
        `start to process message ${messageType} for entity ${entityId}`
      );
      try {
        if (messageProcessors[messageType]) {
          const messageBody = JSON.parse(message.Body);
          await messageProcessors[messageType](entityId, messageBody);
        }
      } catch (err) {
        logger.error(
          `fail to process message ${messageType} for entity ${entityId} with Error: `,
          err
        );
      }
    }
  });

  consumer.on('error', err => {
    logger.error(`Consumer critical error: ${err.message}`);
  });

  consumer.on('processing_error', err => {
    logger.error(`Consumer processing error: ${err.message}`);
  });

  consumer.start();
};

export const Consumer = {
  addMessageProcessor,
  startConsumer
};
