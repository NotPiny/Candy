const { ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'rp',
    description: 'Roleplay commands :D',
    options: [
        {
            name: 'kill',
            description: `Vanquish your enemies!`,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'target',
                    description: 'The user to kill',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'hug',
            description: `Give someone a hug!`,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'target',
                    description: 'The user to hug',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        }
    ]
}

/**@param {{ interaction: ChatInputCommandInteraction }} param0*/
module.exports.run = async({interaction}) => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'kill') {
        const target = interaction.options.getUser('target');

        function checkInput() {
            switch (target.id) {
                case interaction.user.id:
                    return `Well thats just sad...`;
                case interaction.client.user.id:
                    return `I feel like you're forgetting i make the rules here...`;
                case '900126154881646634':
                    return `How did i know you were going to try that :rolling_eyes:`;
                default:
                    return false;
            }
        }

        if (checkInput() !== false) {
            return await interaction.reply({
                content: checkInput(),
            })
        }
        
        const messages = require('../config/kill.messages.json').deathMessages;
        const message = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target.displayName).replace('{username}', `${interaction.user.displayName}`);

        await interaction.reply({
            content: message,
        })
    }

    if (subcommand === 'hug') {
        const target = interaction.options.getUser('target');

        function checkInput() {
            switch (target.id) {
                case interaction.user.id:
                    return `You can't hug yourself silly!`;
                case interaction.client.user.id:
                    return `I'm not really the hugging type...`;
                default:
                    return false;
            }
        }

        if (checkInput() !== false) {
            return await interaction.reply({
                content: checkInput(),
            })
        }

        const res = await axios.get('https://nekos.life/api/v2/img/hug');
        const image = res.data.url;

        await interaction.reply({
            content: `**${interaction.user.displayName}** hugged **${target.displayName}**!`,
            files: [
                {
                    attachment: image,
                    name: 'hug.gif'
                }
            ]
        })
    }
}