import { ChatInputCommandInteraction, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder, MessageFlags, GuildMember } from "discord.js"
import { Raider } from "../../classes/Raider"
import { CruBot } from "../../cruBot"
import {ManualVerificationContainer} from '../../classes/ManualVerificationContainer'
export async function manualVerify(interaction: ChatInputCommandInteraction, client: CruBot) {
    
    // acknowledge interaction
    let message = new ManualVerificationContainer('Starting manual verification')
    await message.send(interaction)
    
    // get data from interaction
    const _user = interaction.options.getUser('user', true)
    const _ign = interaction.options.getString('ign', true)
    const _role1 = interaction.options.getString('role-1', false)
    const _role2 = interaction.options.getString('role-2', false)


    // check if the username is already taken in the db
    const usernameTaken = await client._db.findMemberByIGN(_ign)
    if (usernameTaken) {
        await new ManualVerificationContainer('IGN is already in use').send(interaction)
        return
    }
    await new ManualVerificationContainer('IGN not used').send(interaction)


}