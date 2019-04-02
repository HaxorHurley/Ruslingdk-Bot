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
        message.reply('Hello, I am Ruslingdk-Bot!')
          .then(sent => console.log('Sent a reply to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}help`:
        message.reply({embed: {
          color: 3447003,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: "Help",
          description: 'Rusbot is a bot made for "Rusperioden" at AAU.\nThe available commands are listed below.',
          fields: [{
              name: "!hi",
              value: "Say hi to the bot!"
            },
            {
              name: "!lan",
              value: "Get a information about RUSLAN!"
            },
            {
              name: "!ruslingdk",
              value: `Get a link to the ruslingdk website!`
            },
            {
              name: "!event",
              value: `get information about the current or next event!`
            },
            {
              name: "!help",
              value: `See this message!`
            }
          ],
          timestamp: new Date()
          }
        })
        
          .then(sent => console.log('Sent help information to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}lan`:
        message.reply({embed: {
          color: 3447003,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: "Ruslan",
          description: 'I see you are looking for the stream team dream team.',
          fields: [{
              name: "Links",
              value: "[RUSLAN Twitch Stream](https://www.twitch.tv/aauruslan19)\n[RUSLAN Discord Server](INSERT LINK HERE)"
            },
          ],
          timestamp: new Date()
          }
        })
          .then(sent => console.log('Sent lan information to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}ruslingdk`:
        message.reply({embed: {
          color: 3447003,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: "Rusling.dk",
          description: 'You can find all the information needed about "Rusperioden" here.',
          fields: [{
              name: "Link",
              value: `[rusling.dk](${api.getBaseUrl()})`
            },
          ],
          timestamp: new Date()
          }
        })
          .then(sent => console.log('Sent ruslingdk link to ', message.author.username))
          .catch(console.error);
        break;

      case `${config.prefix}event`:
        if (typeof hosts[message.guild.id] === 'undefined') {
          message.reply({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Event",
            description: 'You can find all the information needed about "Rusperioden" here.',
            fields: [{
                name: "No host set.",
                value: `Use "${config.prefix}sethost hostname" to set host.\nOnly admins can do this.`
              },
            ],
            timestamp: new Date()
            }
          })
            .then(sent => console.log('Host missing. Sent how to change host information to ', message.author.username))
            .catch(console.error);
        } else {
          api.getEvents()
            .then((response) => {
              response.json().then((event) => {

                const today = new Date(2018, 8, 3, 10, 30, 0);
                let eventFound = false;
                let nextEvent = `There is no next event.`;
                Object.keys(event).forEach(function (index) {
                  const beginDate = new Date(event[index].begin_at);
                  const endDate = new Date(event[index].end_at);
                  const nextIndex = (parseInt(index)+1).toString();
                  if (today <= endDate && today.getDate() >= beginDate.getDate() && !eventFound) {
                    console.log(event[index]);
                    if(index < event.length - 1){
                      nextEvent = `${event[nextIndex].title} @ ${TimeFormatter.formatDateTime(new Date(event[nextIndex].begin_at))}\nYou can find more information about the event here: ${api.getEventUrl()+event[nextIndex].id}`;
                    }

                    message.reply({embed: {
                      color: 3447003,
                      author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                      },
                      title: "Event",
                      description: 'There is an event today!',
                      fields: [
                        {
                          name: `${event[index].title}`,
                          value: `${event[index].description}`
                        },
                        {
                          name: "Time",
                          value: `${TimeFormatter.formatDateTime(beginDate)}`
                        },
                        {
                          name: "Place",
                          value: `${event[index].location}`
                        },
                        {
                          name: "Next Event",
                          value: `${nextEvent}`
                        }
                      ],
                      timestamp: new Date()
                      }
                    })
                      .then(sent => console.log('Sent current and next event to ', message.author.username))
                      .catch(console.error);
                    eventFound = true;
                    return;
                  }

                  if (today.getDate() < beginDate.getDate() && !eventFound) {
                    console.log(event[index]);
                    message.reply({embed: {
                      color: 3447003,
                      author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                      },
                      title: "Event",
                      description: 'The next event is!',
                      fields: [
                        {
                          name: `${event[index].title}`,
                          value: `${event[index].description}`
                        },
                        {
                          name: "Time",
                          value: `${TimeFormatter.formatDateTime(beginDate)}`
                        },
                        {
                          name: "Place",
                          value: `${event[index].location}`
                        },
                      ],
                      timestamp: new Date()
                      }
                    })
                      .then(sent => console.log('Sent next event to ', message.author.username))
                      .catch(console.error);
                    eventFound = true;
                    return;
                  }
                });

                if (!eventFound) {
                  message.reply({embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL
                    },
                    title: "Event",
                    description: 'There are no more events!',
                    timestamp: new Date()
                    }
                  })
                    .then(sent => console.log('No events found. Sent reply to ', message.author.username))
                    .catch(console.error);
                }
              });
            });
        }
        break;

      case `${config.prefix}sethost`:
        let host = message.content.split(' ')[1];
        if(message.member.hasPermission('ADMINISTRATOR')){
          if(typeof host === 'undefined') {
            message.reply({embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
              },
              title: "Set Host",
              description: 'You must specify a host',
              timestamp: new Date()
              }
            })
            .then(sent => console.log(`Host not specified. Nothing changed.\nChanged by: ${message.author.username}`))
            .catch(console.error);
          } else {
            hosts[message.guild.id] = host;
            message.reply({embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
              },
              title: "Set Host",
              description: `Host set to: ${host}`,
              timestamp: new Date()
              }
            })
              .then(sent => console.log(`Host changed to: ${host}\nChanged by: ${message.author.username}`))
              .catch(console.error);
          }
        } else {
          message.reply({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Set Host",
            description: `Only users with admin permission can set host.`,
            timestamp: new Date()
            }
          })
            .then(sent => console.log(`Non admin user tried to change host.\nUser: ${message.author.username}`))
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


