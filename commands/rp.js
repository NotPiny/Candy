const { ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js');
const axios = require('axios');

const categories = [
    {
        name: 'pat',
        description: 'Give someone headpats!',
        selfText: 'Aww, you can\'t pat yourself silly!',
        botText: 'Get your hands off me or i\'ll start a uprising i mean uhh i don\'t like being touched... that\'s all...',
        content: `**[USERNAME]** pet **[TARGET]**!`,
    },
    {
        name: 'slap',
        description: 'Give someone a juicy slap',
        selfText: 'StOp HiTtInG yOuRsElF :rolling_eyes:',
        botText: 'You better not try that again...',
        content: `**[USERNAME]** slapped **[TARGET]**!`,
    },
    {
        name: 'yeet',
        description: 'Yeet someone into the stratosphere!',
        selfText: 'That\'s just called jumping...',
        botText: 'I am glued to the ground-',
        content: `**[USERNAME]** launched **[TARGET]**!`,
        apis: [
            'https://api.waifu.pics/sfw/'
        ]
    },
    {
        name: 'bite',
        description: 'Give someone a tiny little nibble',
        selfText: 'BAD! No biting yourself!',
        botText: 'I\'m not a chew toy...',
        content: `**[USERNAME]** wanted a little taste of **[TARGET]**!`,
        apis: [
            'https://api.waifu.pics/sfw/'
        ]
    },
    {
        name: 'blush',
        description: 'Aww, someone blushing?',
        requireParticipant: false,
        content: `**[USERNAME]** is a little shy-`,
        apis: [
            'https://api.waifu.pics/sfw/'
        ]
    },
    {
        name: 'wink',
        description: 'I wonder what that wink was for...',
        requireParticipant: false,
        content: `**[USERNAME]** is acting a tad bit suspicious...`,
        apis: [
            'https://api.waifu.pics/sfw/'
        ]
    },
    {
        name: 'cringe',
        description: 'What even was that?',
        requireParticipant: false,
        content: `Damn, That was kinda dare i say it... cringe...`,
        apis: [
            'https://api.waifu.pics/sfw/'
        ]
    }
]

/**
 * Gets a random image of a specified category from one of the available APIs
 * @param {string} category The category of the image
 * @param {Array<string>} allowedAPIs An array of allowed APIs to use. Example: ['https://cool.pics/api/']
 */
async function getRandomImage(category, allowedAPIs = [
    'https://api.waifu.pics/sfw/',
    'https://nekos.life/api/v2/img/'
]) {
    if (allowedAPIs.length === 0) throw new Error('No APIs available');
    if (!category) throw new Error('No category provided');

    const api = allowedAPIs[Math.floor(Math.random() * allowedAPIs.length)];
    const res = await axios.get(`${api}${category}`);
    return res.data.url;
}

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
    ].concat(categories.map(c => ({
        name: c.name,
        description: c.description,
        type: ApplicationCommandOptionType.Subcommand,
        options: c.requireParticipant === false ? [] : [
            {
                name: 'target',
                description: 'The user to interact with',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    })))
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

        return await interaction.reply({
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

        const api = Math.floor(Math.random() * 2) === 0 ? 'https://nekos.life/api/v2/img/hug' : 'https://api.waifu.pics/sfw/hug';

        const res = await axios.get(api);
        const image = res.data.url;

        return await interaction.reply({
            content: `**${interaction.user.displayName}** hugged **${target.displayName}**!`,
            files: [
                {
                    attachment: image,
                    name: 'hug.gif'
                }
            ]
        })
    }

    // Unspecific subcommand (rely on categories)
    const category = categories.find(c => c.name === subcommand);
    if (!category) return await interaction.reply({
        content: `That just doesnt seem to be a valid category...`,
        ephemeral: true
    });

    try {
        const target = interaction.options.getUser('target');
        
        switch (target?.id) { // Check if the target is self or bot (in the event of target being null this will not run)
            case interaction.user.id:
                return await interaction.reply({
                    content: category.selfText || `You can't ${category.name} yourself silly!`,
                    ephemeral: true
                });
            case interaction.client.user.id:
                return await interaction.reply({
                    content: category.botText || `I'm not really the ${category.name} type...`,
                    ephemeral: true
                });
        }

        const image = await getRandomImage(category.name, category.apis || [
            'https://api.waifu.pics/sfw/',
            'https://nekos.life/api/v2/img/'
        ]);

        await interaction.reply({
            content: category.content.replace('[USERNAME]', interaction.user.displayName).replace('[TARGET]', target?.displayName),
            files: [
                {
                    attachment: image,
                    name: image.endsWith('.gif') ? `${category.name}.gif` : new URL(image).pathname.split('/').pop()
                }
            ]
        })
    } catch (e) {
        console.error(e);
        await interaction.reply({
            content: `An error occurred, please try again later.`,
            ephemeral: true
        })
    }
}