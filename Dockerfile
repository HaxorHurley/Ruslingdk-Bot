FROM node:latest
RUN mkdir -p /usr/src/RusBot
WORKDIR /usr/src/RusBot
COPY RusBot/package.json /usr/src/RusBot
RUN npm install
COPY ./RusBot /usr/src/RusBot
CMD ["node", "index.js"]