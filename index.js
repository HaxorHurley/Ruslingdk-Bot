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
                message.reply('Hey Im a reaply!')
                .then(sent => console.log('Sent a reply to ${sent.author.username}'))
                .catch(console.error);         
                break;
        
            default:
                break;
        }
    }
})

client.login(token);