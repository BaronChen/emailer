import logger from '@lib/logger';
import { SQS } from 'aws-sdk';
import { IEventBase } from './eventBase';

const queueUrl =
  process.env.SQS_URL ||
  'https://sqs.ap-southeast-2.amazonaws.com/677611292116/emailer-event-queue.fifo';

const publishEvent = async (event: IEventBase): Promise<boolean> => {
  const sqs = new SQS();
  const params: SQS.SendMessageRequest = {
    MessageAttributes: {
      EntityId: {
        DataType: 'String',
        StringValue: event.entityId
      },
      EventType: {
        DataType: 'String',
        StringValue: event.eventType
      }
    },
    MessageBody: JSON.stringify(event),
    MessageGroupId: event.eventId,
    QueueUrl: queueUrl
  };

  try {
    const result = await sqs.sendMessage(params).promise();
    if (result.$response.error) {
      throw result.$response.error;
    }
    return true;
  } catch (err) {
    logger.error(
      `Fail to send event ${event.eventType} for entity ${
        event.eventType
      } with err: `,
      err
    );
    // TODO: Retry mechanism for re-publish message
    return false;
  }
};

export default {
  publishEvent
};
