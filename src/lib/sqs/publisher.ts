import logger from '@lib/logger';
import { SQS } from 'aws-sdk';
import { IMessageBase } from './messageBase';

const queueUrl =
  process.env.SQS_URL ||
  'https://sqs.ap-southeast-2.amazonaws.com/677611292116/emailer-message-queue.fifo';

const publishMessage = async (message: IMessageBase): Promise<boolean> => {
  const sqs = new SQS();
  const params: SQS.SendMessageRequest = {
    MessageAttributes: {
      EntityId: {
        DataType: 'String',
        StringValue: message.entityId
      },
      MessageType: {
        DataType: 'String',
        StringValue: message.messageType
      }
    },
    MessageBody: JSON.stringify(message),
    MessageGroupId: message.entityId,
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
      `Fail to publish message ${message.messageType} for entity ${
        message.entityId
      } with err: `,
      err
    );
    // TODO: Retry mechanism for re-publish message
    return false;
  }
};

export default {
  publishMessage
};
