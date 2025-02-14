const { ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: 'vibecheck',
    description: 'Checks your vibe!',
    options:[
        {
            name: 'limit',
            description: 'The max vibe the user can have (Default: 100)',
            type: ApplicationCommandOptionType.Integer,
            required: false
        },
        {
            name: 'user',
            description: 'The user to check the vibe of',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ]
}

/**@param {{ interaction: ChatInputCommandInteraction }} param0*/
module.exports.run = async ({interaction}) => {
    const limit = interaction.options.getInteger('limit') || 100;
    const user = interaction.options.getUser('user') || interaction.user;

    await interaction.reply(`Checking the vibe of ${user.displayName || user.username}...`);
    const vibe = Math.floor(Math.random() * limit);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await interaction.editReply(`${user.displayName || user.username} has a ${vibe}/${limit} vibe!`);
}