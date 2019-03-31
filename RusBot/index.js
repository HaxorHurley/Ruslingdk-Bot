const Discord = require('discord.js');
const fetch = require("node-fetch");
const {prefix, token } = require('./config.json');
const client = new Discord.Client();
host = '';
client.once('ready', () =>{ 
    console.log('ready')
} )

client.on('message', message => {
    if (message.content.charAt(0) === '!'){
        switch (message.content.split(' ')[0]) {
            case '!hi':
                message.reply('Hey Im a reply!')
                .then(sent => console.log('Sent a reply to ', message.author.username))
                .catch(console.error);         
                break;
            
            case '!help':
                message.reply(`Rusbot is a bot made for "Rusperioden" at AAU.\nThe available commands are listed below:\n\t!hi\t\t\t\t\t\t  Say hi to the bot!\n\t!stream\t\t\t\tGet a link to the stream!\n\t!ruslingdk\t\t\tGet a link to the ruslingdk website!\n\t!help\t\t\t\t\t See this message!`)
                .then(sent => console.log('Sent help to ',message.author.username))
                .catch(console.error)
                break;

            case '!stream':
                message.reply('I see you are looking for the stream team dream team. Go to https://twitch.tv to watch the stream.')
                .then(sent => console.log('Sent Stream link to ', message.author.username))
                .catch(console.error)
                break;

            case '!ruslingdk':
                message.reply('You can find all the information needed about "Rusperioden" here: https://www.rusling.dk/.')
                .then(sent => console.log('Sent ruslingdk link to ', message.author.username))
                .catch(console.error)
                break;

            case '!event':
                if(host == ''){
                    message.reply('No host set. Use "!sethost hostname" to set host.')
                    .then(sent => console.log('Host missing. Sent how to change host information to ', message.author.username))
                    .catch(console.error)    
                } else {
                    getEvents(host, message)
                }
                break;

            case '!sethost':
                message.reply('Host set to: '+message.content.split(' ')[1])
                .then(sent => console.log('Host changed to: '+message.content.split(' ')[1]+'\nChanged by: '+message.author.username))
                .catch(console.error)
                host = message.content.split(' ')[1]
                break;

            default:
                break;
        }
    }
})

client.login(token);


function getEvents(host, message){
    url = 'http://'+host+'.rusling.dk/events.json';
    fetch(url)
        .then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
            // Check timestamps of events beginning from today
            // If today is between time start and time end of event, link that event
            // If no event is found today, then link the first upcoming event.
            var today = Date.now()
            var eventFound = false
            for(var key in data){
                beginDate = new Date(data[key].begin_at)
                endDate = new Date(data[key].end_at)
                if(1 == 1){
                    console.log(data[key]);
                    message.reply('There is an event today at:\n'+JSON.stringify(data[key].location)
                    +' where '+JSON.stringify(data[key].title)
                    +' will be happening. It started at '+beginDate.toLocaleString('da')
                    +'. The describion of the event: '+JSON.stringify(data[key].description))                    
                    .then(sent => console.log('Sent events to ', message.author.username))
                    .catch(console.error)
                    eventFound = true
                    break;
                } else if (today <= endDate) {
                    console.log(data[key]);
                    message.reply('The next event is:\n'+JSON.stringify(data[key]))
                    .then(sent => console.log('Sent events to ', message.author.username))
                    .catch(console.error)
                    eventFound = true
                    break;
                }
            }
            if(!eventFound) {
                message.reply('There are no more events! Become a tutor next year, and take part in the fun again!')
                .then(sent => console.log('Sent events to ', message.author.username))
                .catch(console.error)
            }
            
        });
        }
    )
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
  }