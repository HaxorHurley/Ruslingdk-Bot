/* eslint no-unused-vars: ["error", { "args": "none" }] */

import Discord from 'discord.js';
import { ApiService, TimeFormatter } from './utils';
import config from './config';

let hosts = {};

const client = new Discord.Client();

client.once('ready', () => console.log('ready'));

client.on('message', (message) => {
  if (message.content.charAt(0) === config.prefix) {
    const api = new ApiService(message, hosts[message.guild.id]);
    switch (message.content.split(' ')[0]) {
      // Todo: Refactor this with first-class.citizens; of a commands objects:
      // e.g. { "command": () => { ... } }
      case `${config.prefix}hi`:
        message.reply('Hey Im a reply!')
          .then(sent => console.log('Sent a reply to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}help`:
        message.reply('Rusbot is a bot made for "Rusperioden" at AAU.\nThe available commands are listed below:\n\t!hi\t\t\t\t\t\t  Say hi to the bot!\n\t!stream\t\t\t\tGet a link to the stream!\n\t!ruslingdk\t\t\tGet a link to the ruslingdk website!\n\t!help\t\t\t\t\t See this message!')
          .then(sent => console.log('Sent help to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}stream`:
        message.reply('I see you are looking for the stream team dream team. Go to https://twitch.tv to watch the stream.')
          .then(sent => console.log('Sent Stream link to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}ruslingdk`:
        message.reply(`You can find all the information needed about "Rusperioden" here: ${api.getBaseUrl()}.`)
          .then(sent => console.log('Sent ruslingdk link to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}event`:
        if (typeof hosts[message.guild.id] === 'undefined') {
          message.reply(`No host set. Use "${config.prefix}sethost hostname" to set host.`)
            .then(sent => console.log('Host missing. Sent how to change host information to ', message.author.username))
            .catch(console.error);
        } else {
          api.getEvents()
            .then((response) => {
              response.json().then((data) => {
                console.log(data);

                const today = new Date(2018, 8, 3, 10, 30, 0);
                let eventFound = false;

                Object.values(data).forEach((event) => {
                  const beginDate = new Date(event.begin_at);
                  const endDate = new Date(event.end_at);
                  if (today <= endDate && today.getDate() >= beginDate.getDate() && !eventFound) {
                    console.log(event);
                    message.reply(
                      `There is an event today at:\n${event.location
                      } where ${event.title} will be happening. It started at ${TimeFormatter.formatDateTime(beginDate)
                      }. You can find more information about the event here: ${api.getEventUrl()+event.id}`,
                    )
                      .then(sent => console.log('Sent events to ', message.author.username))
                      .catch(console.error);
                    eventFound = true;
                    return;
                  }

                  if (today <= beginDate && !eventFound) {
                    console.log(event);
                    message.reply(`The next event is:\n${event.title} @ ${TimeFormatter.formatDateTime(beginDate)}\nYou can find more information about the event here: ${api.getEventUrl()+event.id}`)
                      .then(sent => console.log('Sent events to ', message.author.username))
                      .catch(console.error);
                    eventFound = true;
                    return;
                  }
                });

                if (!eventFound) {
                  message.reply('There are no more events! Become a tutor next year, and take part in the fun again!')
                    .then(sent => console.log('Sent events to ', message.author.username))
                    .catch(console.error);
                }
              });
            });
        }
        break;

      case `${config.prefix}sethost`:
        let host = message.content.split(' ')[1];
        if(typeof host === 'undefined') {
          message.reply(`You must specify a host`)
          .then(sent => console.log(`Host not specified. Nothing changed.\nChanged by: ${message.author.username}`))
          .catch(console.error);
        } else {
          hosts[message.guild.id] = host;
          message.reply(`Host set to: ${host}`)
            .then(sent => console.log(`Host changed to: ${host}\nChanged by: ${message.author.username}`))
            .catch(console.error);
        }
        
        /* eslint-disable-next-line prefer-destructuring */
        break;

      default:
        break;
    }
  }
});
console.log("Logging in")
client.login(config.token);
