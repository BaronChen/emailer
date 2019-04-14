#!/bin/bash

docker tag emailer 677611292116.dkr.ecr.ap-southeast-2.amazonaws.com/emailer:latest

docker push 677611292116.dkr.ecr.ap-southeast-2.amazonaws.com/emailer

ecs-cli compose --file docker-compose.yml --file docker-compose.ecs.yml service up