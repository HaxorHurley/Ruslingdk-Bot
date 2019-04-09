/* eslint no-unused-vars: ['error', { 'args': 'none' }] */

import Discord from "discord.js";
import { ApiService, TimeFormatter, Admin } from "./utils";
import config from "./config";

const hosts = {};
const tutorRequests = {};
const instruktørRequests = {};
const konsulentRequests = {};
let role = "";
let approved = "";

const client = new Discord.Client();

client.once("ready", () => console.log("ready"));

client.on("message", message => {
  if (message.content.charAt(0) === config.prefix) {
    const api = new ApiService(message, hosts[message.guild.id]);
    const admin = new Admin(message);
    const input = message.content.split(" ")[1];

    switch (message.content.split(" ")[0]) {
      // Todo: Refactor this with first-class.citizens; of a commands objects:
      // e.g. { 'command': () => { ... } }
      case `${config.prefix}hi`:
        message
          .reply("Hello, I am Ruslingdk-Bot!")
          .then(sent =>
            console.log("Sent a reply to ", message.author.username)
          )
          .catch(console.error);
        break;
      // #region Regular Commands
      case `${config.prefix}help`:
        message
          .reply({
            embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL,
              },
              title: "Help",
              description:
                'Rusbot is a bot made for "Rusperioden" at AAU.\nThe available commands are listed below.',
              fields: [
                {
                  name: `${config.prefix}hi`,
                  value: "Say hi to the bot!",
                },
                {
                  name: `${config.prefix}lan`,
                  value: "Get a information about RUSLAN!",
                },
                {
                  name: `${config.prefix}ruslingdk`,
                  value: "Get a link to the ruslingdk website!",
                },
                {
                  name: `${config.prefix}event`,
                  value: "get information about the current or next event!",
                },
                {
                  name: `${config.prefix}help`,
                  value: "See this message!",
                },
              ],
              timestamp: new Date(),
            },
          })

          .then(sent =>
            console.log("Sent help information to ", message.author.username)
          )
          .catch(console.error);
        break;

      case `${config.prefix}lan`:
        message
          .reply({
            embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL,
              },
              title: "Ruslan",
              description:
                "I see you are looking for the stream team dream team.",
              fields: [
                {
                  name: "Links",
                  value:
                    "[RUSLAN Twitch Stream](https://www.twitch.tv/aauruslan19)\n[RUSLAN Discord Server](INSERT LINK HERE)",
                },
              ],
              timestamp: new Date(),
            },
          })
          .then(sent =>
            console.log("Sent lan information to ", message.author.username)
          )
          .catch(console.error);
        break;

      case `${config.prefix}ruslingdk`:
        message
          .reply({
            embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL,
              },
              title: "Rusling.dk",
              description:
                'You can find all the information needed about "Rusperioden" here.',
              fields: [
                {
                  name: "Link",
                  value: `[rusling.dk](${api.getBaseUrl()})`,
                },
              ],
              timestamp: new Date(),
            },
          })
          .then(sent =>
            console.log("Sent ruslingdk link to ", message.author.username)
          )
          .catch(console.error);
        break;

      case `${config.prefix}event`:
        if (typeof hosts[message.guild.id] === "undefined") {
          message
            .reply({
              embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL,
                },
                title: "Event",
                description:
                  'You can find all the information needed about "Rusperioden" here.',
                fields: [
                  {
                    name: "No host set.",
                    value: `Use '${
                      config.prefix
                    }sethost hostname' to set host.\nOnly admins can do this.`,
                  },
                ],
                timestamp: new Date(),
              },
            })
            .then(sent =>
              console.log(
                "Host missing. Sent how to change host information to ",
                message.author.username
              )
            )
            .catch(console.error);
        } else {
          api.getEvents().then(response => {
            response.json().then(event => {
              const today = new Date(2018, 8, 3, 10, 30, 0);
              let eventFound = false;
              let nextEvent = "There is no next event.";
              Object.keys(event).forEach(index => {
                const beginDate = new Date(event[index].begin_at);
                const endDate = new Date(event[index].end_at);
                const nextIndex = (parseInt(index, 10) + 1).toString();
                if (
                  today <= endDate &&
                  today.getDate() >= beginDate.getDate() &&
                  !eventFound
                ) {
                  console.log(event[index]);
                  if (index < event.length - 1) {
                    nextEvent = `${
                      event[nextIndex].title
                    } @ ${TimeFormatter.formatDateTime(
                      new Date(event[nextIndex].begin_at)
                    )}\nYou can find more information about the event here: ${api.getEventUrl() +
                      event[nextIndex].id}`;
                  }

                  message
                    .reply({
                      embed: {
                        color: 3447003,
                        author: {
                          name: client.user.username,
                          icon_url: client.user.avatarURL,
                        },
                        title: "Event",
                        description: "There is an event today!",
                        fields: [
                          {
                            name: `${event[index].title}`,
                            value: `${event[index].description}`,
                          },
                          {
                            name: "Time",
                            value: `${TimeFormatter.formatDateTime(beginDate)}`,
                          },
                          {
                            name: "Place",
                            value: `${event[index].location}`,
                          },
                          {
                            name: "Next Event",
                            value: `${nextEvent}`,
                          },
                        ],
                        timestamp: new Date(),
                      },
                    })
                    .then(sent =>
                      console.log(
                        "Sent current and next event to ",
                        message.author.username
                      )
                    )
                    .catch(console.error);
                  eventFound = true;
                  return;
                }

                if (today.getDate() < beginDate.getDate() && !eventFound) {
                  console.log(event[index]);
                  message
                    .reply({
                      embed: {
                        color: 3447003,
                        author: {
                          name: client.user.username,
                          icon_url: client.user.avatarURL,
                        },
                        title: "Event",
                        description: "The next event is!",
                        fields: [
                          {
                            name: `${event[index].title}`,
                            value: `${event[index].description}`,
                          },
                          {
                            name: "Time",
                            value: `${TimeFormatter.formatDateTime(beginDate)}`,
                          },
                          {
                            name: "Place",
                            value: `${event[index].location}`,
                          },
                        ],
                        timestamp: new Date(),
                      },
                    })
                    .then(sent =>
                      console.log(
                        "Sent next event to ",
                        message.author.username
                      )
                    )
                    .catch(console.error);
                  eventFound = true;
                }
              });

              if (!eventFound) {
                message
                  .reply({
                    embed: {
                      color: 3447003,
                      author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL,
                      },
                      title: "Event",
                      description: "There are no more events!",
                      timestamp: new Date(),
                    },
                  })
                  .then(sent =>
                    console.log(
                      "No events found. Sent reply to ",
                      message.author.username
                    )
                  )
                  .catch(console.error);
              }
            });
          });
        }
        break;
      //#endregion Regular Commands
      //#region Role Commands
      case `${config.prefix}rusling`:
        role = message.guild.roles.find(r => r.name === "Rusling");
        member
          .addRole(role)
          .then(sent =>
            console.log(
              'Gave user the role "Rusling" ',
              message.author.username
            )
          )
          .catch(console.error);
        break;

      case `${config.prefix}tutor`:
        role = message.guild.roles.find(r => r.name === "Tutor");
        tutorRequests[message.author.username] = role;
        console.log(
          'Added user the list of users waiting for approval for the role "Tutor" ',
          message.author.username
        );
        break;

      case `${config.prefix}instruktør`:
        role = message.guild.roles.find(r => r.name === "Instruktør");
        instruktørRequests[message.author.username] = role;
        console.log(
          'Added user the list of users waiting for approval for the role "Instruktør" ',
          message.author.username
        );
        break;

      case `${config.prefix}konsulent`:
        role = message.guild.roles.find(r => r.name === "Konsulent");
        konsulentRequests[message.author.username] = role;
        console.log(
          'Added user the list of users waiting for approval for the role "Konsulent" ',
          message.author.username
        );
        break;
      //#endregion Role Commands
      //#region Admin Commands
      case `${config.prefix}adminhelp`:
        if (admin.checkAdmin()) {
          if (message.guild.channels.find("name", "bot-channel") === null) {
            console.log("No admin channel found", message.author.username);
          } else {
            message.guild.channels
              .find("name", "bot-channel")
              .send({
                embed: {
                  color: 3447003,
                  author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                  },
                  title: "Admin Help",
                  description:
                    'Rusbot is a bot made for "Rusperioden" at AAU.\nThe available admin commands are listed below.',
                  fields: [
                    {
                      name: `${config.prefix}sethost`,
                      value:
                        "Sets the host of the bot to your educational domain.",
                    },
                    {
                      name: `${config.prefix}seerolerequests`,
                      value:
                        "Gets a list of all the users who have asked to get either the Tutor or Instruktør role.",
                    },
                    {
                      name: `${config.prefix}remove`,
                      value:
                        "Removes a user from the list of the users who have asked to get either the Tutor or Instruktør role.",
                    },
                    {
                      name: `${config.prefix}approveall`,
                      value:
                        "Approves all the users waiting for approval on getting either the Tutor or Instruktør role.",
                    },
                    {
                      name: `${config.prefix}approve`,
                      value:
                        "Approves a users waiting for approval on getting either the Tutor or Instruktør role.",
                    },
                    {
                      name: `${config.prefix}adminhelp`,
                      value: "See this message!",
                    },
                  ],
                  timestamp: new Date(),
                },
              })

              .then(sent =>
                console.log(
                  "Sent help information to ",
                  message.author.username
                )
              )
              .catch(console.error);
          }
        } else {
          message.guild.channels
            .find("name", "bot-channel")
            .send({
              embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL,
                },
                title: "Admin Help",
                description: "You must be an admin to use admin commands.",
                timestamp: new Date(),
              },
            })
            .then(sent =>
              console.log(
                "Non-admin tried to use the adminhelp command",
                message.author.username
              )
            )
            .catch(console.error);
        }
        break;

      case `${config.prefix}seerolerequests`:
        if (admin.checkAdmin()) {
          if (message.guild.channels.find("name", "bot-channel") === null) {
            console.log("No admin channel found", message.author.username);
          } else {
            let tutors =
              Object.keys(tutorRequests).length == 0
                ? "None"
                : JSON.stringify(Object.keys(tutorRequests))
                    .replace("{", "")
                    .replace("}", "");
            let instruktørs =
              Object.keys(instruktørRequests).length == 0
                ? "None"
                : JSON.stringify(Object.keys(instruktørRequests))
                    .replace("{", "")
                    .replace("}", "");
            let konsulents =
              Object.keys(konsulentRequests).length == 0
                ? "None"
                : JSON.stringify(Object.keys(konsulentRequests))
                    .replace("{", "")
                    .replace("}", "");
            message.guild.channels
              .find("name", "bot-channel")
              .send({
                embed: {
                  color: 3447003,
                  author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                  },
                  title: "Role Requests",
                  description:
                    'Here are all the role requests.\nUse "!remove @username" to remove a user from the request list.\n Use "!approve @username", "!approve rolename", or "!approveall" to approve users.',
                  fields: [
                    {
                      name: `Tutor`,
                      value: `${tutors}`,
                    },
                    {
                      name: `Instruktør`,
                      value: `${instruktørs}`,
                    },
                    {
                      name: `Konsulent`,
                      value: `${konsulents}`,
                    },
                  ],
                  timestamp: new Date(),
                },
              })
              .then(sent =>
                console.log(
                  "Printed user role requests. ",
                  message.author.username
                )
              )
              .catch(console.error);
          }
        } else {
          message.guild.channels
            .find("name", "bot-channel")
            .send({
              embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL,
                },
                title: "Admin Help",
                description: "You must be an admin to use admin commands.",
                timestamp: new Date(),
              },
            })
            .then(sent =>
              console.log(
                "Non-admin tried to use the seerolerequests command",
                message.author.username
              )
            )
            .catch(console.error);
        }
        break;

      case `${config.prefix}approve`:
        approved = "";
        if (admin.checkAdmin()) {
          if (message.guild.channels.find("name", "bot-channel") === null) {
            console.log("No admin channel found", message.author.username);
          } else {
            if (typeof message.mentions.users.first().username !== undefined) {
              approved = message.guild.member(message.mentions.users.first());
              if (
                typeof tutorRequests[
                  message.mentions.users.first().username
                ] !== "undefined"
              ) {
                approved.addRole(
                  tutorRequests[message.mentions.users.first().username]
                );
              }
              if (
                typeof instruktørRequests[
                  message.mentions.users.first().username
                ] !== "undefined"
              ) {
                approved.addRole(
                  instruktørRequests[message.mentions.users.first().username]
                );
              }
              if (
                typeof konsulentRequests[
                  message.mentions.users.first().username
                ] !== "undefined"
              ) {
                approved.addRole(
                  konsulentRequests[message.mentions.users.first().username]
                );
              }
            } else if (typeof input !== "undefined") {
              approved = message.guild.roles.find(r => r.name === input);
              if (tutorRequests[0] === input) {
                Object.keys(tutorRequests).forEach(user => {
                  client.users.get("name", user).addRole(approved);
                });
              }
              if (instruktørRequests[0] === input) {
                Object.keys(instruktørRequests).forEach(user => {
                  client.users.get("name", user).addRole(approved);
                });
              }
              if (konsulentRequests[0] === input) {
                Object.keys(konsulentRequests).forEach(user => {
                  client.users.get("name", user).addRole(approved);
                });
              }
            } else {
              message.guild.channels.find("name", "bot-channel").send({
                embed: {
                  color: 3447003,
                  author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                  },
                  title: "Remove",
                  description: "You must specify a user or a role.",
                  timestamp: new Date(),
                },
              });
            }
            message.guild.channels
              .find("name", "bot-channel")
              .send({
                embed: {
                  color: 3447003,
                  author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                  },
                  title: "Approve",
                  description: `Approved ${approved}`,
                  timestamp: new Date(),
                },
              })
              .then(sent =>
                console.log(
                  "Printed user role requests. ",
                  message.author.username
                )
              )
              .catch(console.error);
          }
        } else {
          message.guild.channels
            .find("name", "bot-channel")
            .send({
              embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL,
                },
                title: "Approve",
                description: "You must be an admin to use admin commands.",
                timestamp: new Date(),
              },
            })
            .then(sent =>
              console.log(
                "Non-admin tried to use the approve command",
                message.author.username
              )
            )
            .catch(console.error);
        }
        break;

      case `${config.prefix}approveall`:
        approved = "";
        if (admin.checkAdmin()) {
          if (message.guild.channels.find("name", "bot-channel") === null) {
            console.log("No admin channel found", message.author.username);
          } else {
            approved = message.guild.roles.find(r => r.name === input);
            Object.keys(tutorRequests).forEach(user => {
              message.guild
                .member(client.users.find("username", user))
                .addRole(approved);
            });
            Object.keys(instruktørRequests).forEach(user => {
              message.guild
                .member(client.users.find("username", user))
                .addRole(approved);
            });
            Object.keys(konsulentRequests).forEach(user => {
              message.guild
                .member(client.users.find("username", user))
                .addRole(approved);
            });
            message.guild.channels
              .find("name", "bot-channel")
              .send({
                embed: {
                  color: 3447003,
                  author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                  },
                  title: "Approve",
                  description: `Approved ${approved}`,
                  timestamp: new Date(),
                },
              })
              .then(sent =>
                console.log(
                  "Printed user role requests. ",
                  message.author.username
                )
              )
              .catch(console.error);
          }
        } else {
          message.guild.channels
            .find("name", "bot-channel")
            .send({
              embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL,
                },
                title: "Approve",
                description: "You must be an admin to use admin commands.",
                timestamp: new Date(),
              },
            })
            .then(sent =>
              console.log(
                "Non-admin tried to use the approve command",
                message.author.username
              )
            )
            .catch(console.error);
        }
        break;

      case `${config.prefix}remove`:
        if (admin.checkAdmin()) {
          if (message.guild.channels.find("name", "bot-channel") === null) {
            console.log("No admin channel found", message.author.username);
          } else {
            if (typeof message.mentions.users.first().username !== undefined) {
              delete tutorRequests[message.mentions.users.first().username];
              delete instruktørRequests[
                message.mentions.users.first().username
              ];
              delete konsulentRequests[message.mentions.users.first().username];

              message.guild.channels
                .find("name", "bot-channel")
                .send({
                  embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL,
                    },
                    title: "Remove",
                    description: `Removed user, ${
                      message.mentions.users.first().username
                    }, from approval lists.`,
                    timestamp: new Date(),
                  },
                })
                .then(sent =>
                  console.log(
                    `Removed user, ${
                      message.mentions.users.first().username
                    }, from approval lists.`
                  )
                )
                .catch(console.error);
            } else {
              message.guild.channels
                .find("name", "bot-channel")
                .send({
                  embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL,
                    },
                    title: "Remove",
                    description: `Must specify a user`,
                    timestamp: new Date(),
                  },
                })
                .then(sent => console.log(`No user specified.`))
                .catch(console.error);
            }
          }
        } else {
          message.guild.channels
            .find("name", "bot-channel")
            .send({
              embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL,
                },
                title: "Remove",
                description:
                  "Only users with admin permission can remove users from approval lists.",
                timestamp: new Date(),
              },
            })
            .then(sent =>
              console.log(
                `Non admin user tried to remove users from approval lists.\nUser: ${
                  message.author.username
                }`
              )
            )
            .catch(console.error);
        }
        break;

      case `${config.prefix}sethost`:
        if (admin.checkAdmin()) {
          if (message.guild.channels.find("name", "bot-channel") === null) {
            console.log("No admin channel found", message.author.username);
          } else {
            if (typeof input === "undefined") {
              message.guild.channels
                .find("name", "bot-channel")
                .send({
                  embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL,
                    },
                    title: "Set Host",
                    description: "You must specify a host",
                    timestamp: new Date(),
                  },
                })
                .then(sent =>
                  console.log(
                    `Host not specified. Nothing changed.\nChanged by: ${
                      message.author.username
                    }`
                  )
                )
                .catch(console.error);
            } else {
              hosts[message.guild.id] = input;
              message.guild.channels
                .find("name", "bot-channel")
                .send({
                  embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL,
                    },
                    title: "Set Host",
                    description: `Host set to: ${input}`,
                    timestamp: new Date(),
                  },
                })
                .then(sent =>
                  console.log(
                    `Host changed to: ${input}\nChanged by: ${
                      message.author.username
                    }`
                  )
                )
                .catch(console.error);
            }
          }
        } else {
          message.guild.channels
            .find("name", "bot-channel")
            .send({
              embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL,
                },
                title: "Set Host",
                description: "Only users with admin permission can set host.",
                timestamp: new Date(),
              },
            })
            .then(sent =>
              console.log(
                `Non admin user tried to change host.\nUser: ${
                  message.author.username
                }`
              )
            )
            .catch(console.error);
        }
        /* eslint-disable-next-line prefer-destructuring */
        break;
      //#endregion Admin Commands
      default:
        break;
    }
  }
});
console.log("Logging in");
client.login(config.token);
