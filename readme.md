# Emailer

This is a sample email API that handles failover between SendGrid and MailGun

## Notes

### As my MailGun account is disabled by their system and I can't sign up another one use my credit card, the failover from sendgrid to mailgun will not work in the live demo environment.

## Tech Stack

- NodeJs 10
- TypeScript
- AWS (SQS, ECS)
- Docker

## Overview

Each API call to the POST /emailJob API will create a job stored in MongoDb, and a message will be sent to SQS. A job processor will pick up jobs from the queue and try to send email. If more then 3 failure happen to a provider, the service will failover to another provider.

## API

#### POST /emailJob

Sample Body

```
{
  "from": "example@example.com",
  "to": [ "example1@example.com""],
  "cc": [ "example2@example.com",  "example3@example.com"],
  "body": "test body",
  "subject": "test subject"
}
```

| Field | Required | Type     | Note                                                    |
| ----- | -------- | -------- | ------------------------------------------------------- |
| from  | true     | string   |                                                         |
| to    | true     | string[] | This array require at least one element                 |
| cc    | false    | string[] | Cannot be empty array. If not needed, should be omitted |
| bcc   | false    | string[] | Cannot be empty array. If not needed, should be omitted |

Sample Response

```
{
    "referenceId": "5cb3098014b362001a0d3ce8"
}
```

#### GET /emailJob/{referenceId}

Sample Response

```
{
    "referenceId": "5cb3098014b362001a0d3ce8",
    "status": "Sent",
    "updatedAt": "2019-04-14T10:20:51.928Z",
    "serviceProvider": "SendGrid",
    "retryCount": 4
}
```

## Live Demo

#### GET http://emailer.technerd.me:8888/emailJob/{referenceId}

#### POST http://emailer.technerd.me:8888/emailJob

## Testing using cURL

Send Email

```
curl -X POST \
  http://emailer.technerd.me:8888/emailJob \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
  "from": "duckbar2010@gmail.com",
  "to": ["baron.zhongyangchen@gmail.com", "duckbar2010@gmail.com"],
  "cc": ["baron.zhongyangchen+22@gmail.com", "baron.zhongyangchen+44@gmail.com"],
  "bcc": ["baron.zhongyangchen+333@gmail.com"],
  "body": "test body",
  "subject": "test subject"
}'
```

Query Email Job Status

```
curl -X GET \
  http://emailer.technerd.me:8888/emailJob/5cb312c314b362001a0d3ceb \
  -H 'cache-control: no-cache'
```

## Run Locally

###### Require [Docker](https://www.docker.com)

```
docker-compose up
```

## Develop Locally

```
yarn install
yarn dev
```

## Run Test

```
yarn install
yarn test
```

## To Do

As the time limitation and the purpose of this practice, the service is not production ready. There are several things we could do to improve it.

- resilience of message queue (dead letter queue, message visibility, deduplication window, DLQ, optimistic concurrency control etc.)
- More tests (Full coverage of unit test, add api tests and load tests)
- Databse should be a seperate from the service
- Centralized configuration module to hanle config base on environment
- More robust failover algorithm
- Add webpack to build and bundle typescript
- Better validation message (i.e. when string is used for array field)
- API documentation (Swagger etc.)
