# Ruslingdk-Bot
The Ruslingdk-Bot is a bot made for the convenience of the new students who's "Ruskorps" have decided to use rusling.dk.
The bot has the ability to give roles to students, tutors, and instructors.
The bot can also list the next events that are happening for the given education.

## Development
To build the bot use the command:
```
docker-compose build
```

To run the bot, use either of the commands:
```
docker-compose up
docker-compose up -d
```
### Github
When working on the bot, make a new branch in the following naming scheme:

`{name}/{functionality}`

This can be done by running the following command:
```
git checkout -b branch-name
```
Remember to set the upstream for your branch:
```
git push -u origin branch-name
```

Before pushing to github, you MUST run the following command:
```
cd RusBot && yarn eslint --fix
```
After running this command, fix the remaining errors before pushing.

### Commands
#### Normal commands
```
!hi - Say hi to the bot
!lan - Get a information about RUSLAN! (only relevant for Dat/DS/SW)
!ruslingdk - Get a link to the ruslingdk website!
!event - Get information about the current or next event!.
!help - See a list of available commands.
```

#### Role Commands
```
!rusling - Adds the user to the rusling role.
!tutor - Adds the user to the approval list, for the tutor role.
!instruktør - Adds the user to the approval list, for the instruktør role.
!konsulent - Adds the user to the approval list for the konsulent role.
```

#### Admin commands
```
!sethost {hostname} - Sets the host of the bot to your educational domain.
!seerolerequests - Gets a list of all the users who have asked to get either the Tutor, Instruktør, or Konsulent role.
!remove {@username} - Removes a user from the list of the users who have asked to get either the Tutor, Instruktør, or Konsulent role.
!approveall - Approves all the users waiting for approval on getting either the Tutor, Instruktør, or Konsulent role.
!approve {@username} - Approves a users waiting for approval on getting either the Tutor, Instruktør, or Konsulent role.
!approve {rolename} - Approves all users waiting for approval for the specified role.
!adminhelp - See a list of available commands.
```

## Discord.js
documentation for discord.js
* https://discord.js.org/#/docs/main/stable/general/welcome 

