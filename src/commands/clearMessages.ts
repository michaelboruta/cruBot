import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder, TextChannel } from 'discord.js'
import Command from '../classes/Command'

const clearMessages:Command = {
    data: new SlashCommandBuilder()
        .setName('clearmessages')
        .setDescription('Clears messages in a channel.'),
        
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.deferReply({flags:[MessageFlags.Ephemeral]})
        const channel = interaction.channel as TextChannel
        const messages = await channel.messages.fetch({limit:100})
        channel.bulkDelete(messages)
        interaction.editReply({content:`Cleared ${messages.size} message(s).`})
    }
}

export default clearMessages
