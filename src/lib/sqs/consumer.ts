import logger from '@lib/logger';
import { SQS } from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

const queueUrl =
  process.env.SQS_URL ||
  'https://sqs.ap-southeast-2.amazonaws.com/677611292116/emailer-event-queue.fifo';

interface IEventHanlderRegistry {
  [eventName: string]: (entityId: string, event: any) => Promise<void>;
}

const eventHandlers: IEventHanlderRegistry = {};

const addEventHandler = <T>(
  eventType: string,
  handler: (entityId: string, payload: T) => Promise<void>
) => {
  eventHandlers[eventType] = handler;
};

const consumer: Consumer = Consumer.create({
  queueUrl,
  messageAttributeNames: ['EntityId', 'EventType'],
  handleMessage: async (message: SQS.Message) => {
    const eventType = message.MessageAttributes.EventType.StringValue;
    const entityId = message.MessageAttributes.EntityId.StringValue;
    logger.info(`start to process event ${eventType} for entity ${entityId}`);
    try {
      if (eventHandlers[eventType]) {
        const event = JSON.parse(message.Body);
        await eventHandlers[eventType](entityId, event);
      }
    } catch (err) {
      logger.error(
        `fail to process event ${eventType} for entity ${entityId} with Error: `,
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

const startConsumer = () => {
  consumer.start();
};

export default {
  addEventHandler,
  startConsumer
};
