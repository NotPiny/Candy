const {Client, Routes, ApplicationCommandType, ApplicationCommandOptionType} = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const client = new Client({
    intents: []
});

client.on('ready', () => {
    console.log('Bot is ready');

    const defaultOptions = {
        integration_types: [0, 1],
        contexts: [0, 1, 2]
    }

    const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    for (let i = 0; i < commands.length; i++) {
        const command = require(`./commands/${commands[i]}`);

        client.rest.post(Routes.applicationCommands(client.user.id), {
            body: {
                ...command,
                type: ApplicationCommandType.ChatInput,
                ...defaultOptions
            }
        })
    }

    const messageContexts = fs.readdirSync('./context/message').filter(file => file.endsWith('.js'));
    
    for (let i = 0; i < messageContexts.length; i++) {
        const details = require(`./context/message/${messageContexts[i]}`);

        client.rest.post(Routes.applicationCommands(client.user.id), {
            body: {
                ...details,
                type: ApplicationCommandType.Message,
                ...defaultOptions
            }
        })
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        if (fs.existsSync(`./commands/${interaction.commandName}.js`)) {
            const command = require(`./commands/${interaction.commandName}.js`);
            command.run({interaction});
        }
    }

    if (interaction.isMessageContextMenuCommand()) {
        if (fs.existsSync(`./context/message/${interaction.commandName.toLowerCase()}.js`)) {
            const file = require(`./context/message/${interaction.commandName.toLowerCase()}.js`);
            file.run({interaction});
        }
    }
})

fs.existsSync(`/home/piny/.pm2/logs/CandyDis-out.log`) ? fs.writeFileSync(`/home/piny/.pm2/logs/CandyDis-out.log`, '') : null;

client.login(process.env.TOKEN);