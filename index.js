const {Client, Routes, ApplicationCommandType, ApplicationCommandOptionType} = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const crypto = require('crypto');
const client = new Client({
    intents: []
});
async function hash(str){return crypto.createHash('sha256').update(str).digest('hex');}
async function encrypt(str, key) {const cipher = crypto.createCipher('aes-256-cbc', key);let encrypted = cipher.update(str, 'utf8', 'hex');encrypted += cipher.final('hex');return encrypted;}
async function decrypt(str, key) {const decipher = crypto.createDecipher('aes-256-cbc', key);let decrypted = decipher.update(str, 'hex', 'utf8');decrypted += decipher.final('utf8');return decrypted;}
async function read(guild, key) {
    /**
     * Each object will have its own unique hash that also depends on the guild
     * The guild has its own subfolder to ensure easy removal of data if need be
    */
    const filepath = `./data/` + hash(guild) + `/${hash(guild + key)}.json`;
    if (!fs.existsSync(filepath)) return null;

    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(await decrypt(data, guild)); // Encrypted with the guild id for the sake of having data be a bit more secure (this isnt even sensitive data)
}

async function write(guild, key, data) {
    const filepath = `./data/` + hash(guild) + `/${hash(guild + key)}.json`;
    if (!fs.existsSync(`./data/` + hash(guild))) fs.mkdirSync(`./data/` + hash(guild)); // Cant forget this or we get big scary errors
    fs.writeFileSync(filepath, await encrypt(JSON.stringify(data), guild));
}

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

client.on('messageCreate', async message => {
    let prefix = await read(message.guild.id, 'prefix');
    if (!prefix) prefix = 'c!' && await write(message.guild.id, 'prefix', 'c!'); // Apply default prefix if it doesnt exist

    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    // These have no actual handler, they are mostly just text versions of the slash commands for the sake of being able to use the bot in a more traditional way
})

fs.existsSync(`/home/piny/.pm2/logs/CandyDis-out.log`) ? fs.writeFileSync(`/home/piny/.pm2/logs/CandyDis-out.log`, '') : null;

client.login(process.env.TOKEN);