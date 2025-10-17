import { ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextChannel, TextDisplayBuilder } from "discord.js";
import { CruBot } from "../../cruBot";
import { VerifySelfContainer } from "../../classes/containerBuilders/VerifySelf";

export async function selfVerify(interaction:ChatInputCommandInteraction, client:CruBot) {
    
    await interaction.reply({
            components:[
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({'content': '### ✅ Self verification message sent'}))
            ],
            flags:['IsComponentsV2', 'Ephemeral']
    })



    // verification img
    // separator
    // 

    // send self verification message
    const channel = interaction.channel as TextChannel
    const verifySelfContainer = await (new VerifySelfContainer())._build()
    await channel.send({
        components:verifySelfContainer.components,
        files:verifySelfContainer.files,
        flags:MessageFlags.IsComponentsV2
    })
}