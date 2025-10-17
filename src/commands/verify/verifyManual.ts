import { ChatInputCommandInteraction, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder, MessageFlags, GuildMember, TextDisplayComponent } from "discord.js"
import { Raider } from "../../classes/Raider"
import { CruBot } from "../../cruBot"
import {ManualVerificationContainer} from '../../classes/ManualVerificationContainer'

class BaseMessageContainerBuilder extends ContainerBuilder {
    constructor(title:string, message:string) {
        super()        
        this.addTextDisplayComponents(new TextDisplayBuilder({'content':title}))
        this.addSeparatorComponents(new SeparatorBuilder({'spacing':SeparatorSpacingSize.Small, 'divider':true}))
        this.addTextDisplayComponents(new TextDisplayBuilder({'content':message}))
    }
}

export async function verifyManual(interaction: ChatInputCommandInteraction, client: CruBot) {
    
    // acknowledge interaction
    await interaction.reply({
            components:[
                new BaseMessageContainerBuilder('### 🫆 Verification', 'Manual verification started.')
            ],
            flags:['IsComponentsV2', 'Ephemeral']
    })
    
    // get data from interaction
    const _user = interaction.options.getUser('user', true)
    const _ign = interaction.options.getString('ign', true)
    const _role1 = interaction.options.getString('role-1', false)
    const _role2 = interaction.options.getString('role-2', false)


    // check if the username is already taken in the db
    const _usernameTaken = await client._db.findMemberByIGN(_ign)
    if (_usernameTaken) {
        console.log(_usernameTaken)
        await interaction.editReply({
            components:[
                new BaseMessageContainerBuilder('### ⚠️ Verification warning', `The IGN to verify is already being used.\n- \`${_ign}\` assigned to <@${_usernameTaken.id}>`)
                    .addSeparatorComponents(new SeparatorBuilder({'divider':true, 'spacing':SeparatorSpacingSize.Small}))
                    .addTextDisplayComponents(new TextDisplayBuilder({'content': 'You can reassign the IGN by pressing `Continue`\n- The new account inherit all roles and data from the previous one.\n- The previous account will have all it\'s roles removed.'}))
                    .addSeparatorComponents(new SeparatorBuilder({'divider':true, 'spacing':SeparatorSpacingSize.Small}))
            ],
            flags:'IsComponentsV2'
        })
        return
    }


    await new ManualVerificationContainer('IGN not used').send(interaction)


}