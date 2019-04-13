import { SQS } from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import logger from '../logger';

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
    if (eventHandlers[eventType]) {
      const event = JSON.parse(message.Body);
      await eventHandlers[eventType](entityId, event);
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
