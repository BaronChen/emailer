import { IEmailJobCreated } from '@common/events';

export const emailJobCreatedHandler = async (
  entityId: string,
  event: IEmailJobCreated
) => {
  console.log(JSON.stringify(event));
};
