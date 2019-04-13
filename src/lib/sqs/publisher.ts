import { SQS } from 'aws-sdk';
import logger from '../logger';

const queueUrl =
  process.env.SQS_URL ||
  'https://sqs.ap-southeast-2.amazonaws.com/677611292116/emailer-event-queue.fifo';

const publishEvent = async (
  entityId: string,
  payload: any,
  eventType: string
): Promise<boolean> => {
  const sqs = new SQS();
  const params: SQS.SendMessageRequest = {
    MessageAttributes: {
      EntityId: {
        DataType: 'String',
        StringValue: entityId
      },
      EventType: {
        DataType: 'String',
        StringValue: eventType
      }
    },
    MessageBody: JSON.stringify(payload),
    MessageGroupId: entityId,
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
      `Fail to send event ${eventType} for entity ${entityId} with err ${JSON.stringify(
        err
      )}`
    );
    // TODO: Retry mechanism for re-send message
    return false;
  }
};

export default {
  publishEvent
};
