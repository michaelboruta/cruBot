import { ChatInputCommandInteraction, ContainerBuilder, Interaction, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";

export class ManualVerificationContainer extends ContainerBuilder {
    
    constructor(content:string) {
        super()
        this.addTextDisplayComponents(
            new TextDisplayBuilder({'content':'### Verification'})
        )
        this.addSeparatorComponents(
            new SeparatorBuilder({'divider':true, 'spacing':SeparatorSpacingSize.Small})
        )
        this.addTextDisplayComponents(
            new TextDisplayBuilder({'content':content})
        )
    }

    async send(interaction:ChatInputCommandInteraction) {
        interaction.replied ? 
            await interaction.editReply({components:[this], flags:"IsComponentsV2"}):
            await interaction.reply({components:[this], flags:['Ephemeral','IsComponentsV2'] })
    }
}