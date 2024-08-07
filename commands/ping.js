const { ChatInputCommandInteraction } = require("discord.js")

module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
}

/**@param {{ interaction: ChatInputCommandInteraction }} param0*/
module.exports.run = async ({interaction}) => {
    const start = Date.now();
    await interaction.reply('Pong!');
    const end = Date.now();
    await interaction.editReply(`Pong! (${end - start}ms)`);
}