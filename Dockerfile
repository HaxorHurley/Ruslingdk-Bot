FROM node:latest
RUN mkdir -p /usr/src/RusBot
WORKDIR /usr/src/RusBot
COPY RusBot/package.json /usr/src/RusBot
RUN yarn install
COPY ./RusBot /usr/src/RusBot
CMD ["yarn", "start"]
