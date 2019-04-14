FROM node:10.15.3

WORKDIR /tmp
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install

WORKDIR /app
RUN mv /tmp/node_modules ./
COPY . .
EXPOSE 8889
ENTRYPOINT [ "yarn", "start" ]