const { ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js');
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
        }
    ]
}

/**@param {{ interaction: ChatInputCommandInteraction }} param0*/
module.exports.run = async({interaction}) => {
    if (interaction.options.getSubcommand() === 'kill') {
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
}