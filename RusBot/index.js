const Discord = require('discord.js');
const {prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () =>{ 
    console.log('ready')
} )

client.on('message', message => {
    if (message.content.charAt(0) === '!'){
        switch (message.content) {
            case '!hi':
                message.reply('Hey Im a reply!')
                .then(sent => console.log('Sent a reply to ', message.author.username))
                .catch(console.error);         
                break;
            
            case '!help':
                message.reply('Use !hi to say hi, !stream to get a stream link, !ruslingdk for all information or !help for help')
                .then(sent => console.log('Sent help to ', message.author.username))
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

            default:
                message.reply('Sorry, i do not know what you mean. You are welcome to try again')
                .then(sent => console.log('Sent default message to ', message.author.username))
                .catch(console.error)
                break;
        }
    }
})

client.login(token);