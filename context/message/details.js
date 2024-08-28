const { MessageContextMenuCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'Details'
}

/**@param {{ interaction: MessageContextMenuCommandInteraction }} param0*/
module.exports.run = async({interaction}) => {
    let authorType = 'Unknown';
    if (interaction.targetMessage.author.system) authorType = 'System' // System should take priority as the payload will include bot: true, system: true
    else if (interaction.targetMessage.author.bot && interaction.targetMessage.author.discriminator === '0000') authorType = 'Webhook' // Could be a system message since they send through webhooks ig
    else if (interaction.targetMessage.author.bot) authorType = 'Bot'
    else authorType = 'User'

    const embed = new EmbedBuilder()
        .setTitle('Message Info')
        .setAuthor({
            name: `${interaction.targetMessage.author.username}`,
            iconURL: interaction.targetMessage.author.displayAvatarURL()
        })
        .addFields([
            {
                name: 'Author',
                value: `${authorType} with ID: \`${interaction.targetMessage.author.id}\``,
            },
            {
                name: 'Content',
                value: `${interaction.targetMessage.content || 'None'}`,
                inline: false
            },
        ])
        .setFooter({
            text: `Message ID: ${interaction.targetMessage.id}`
        })
        .setTimestamp(interaction.targetMessage.createdTimestamp)
        .setColor(interaction.targetMessage.author.accentColor ?? null)

    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}