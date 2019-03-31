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
                .then(sent => console.log('Sent a reply to ${sent.author.username}'))
                .catch(console.error);         
                break;
            
            case '!help':
                message.reply('Use !hi to say hi or !help for help')
                .then(sent => console.log('Sent help to ${sent.author.username}'))
                .catch(console.error)
            default:
                break;
        }
    }
})

client.login(token);