import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, TextChannel, ButtonBuilder, ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, SectionBuilder, ActionRowBuilder, ActionRow, ButtonStyle, Emoji, FileBuilder, AttachmentBuilder, MessagePayload, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, SlashCommandRoleOption, SlashCommandUserOption, SlashCommandStringOption, Interaction, GuildMember } from 'discord.js';
import Command from '../classes/Command';
import { CruBot } from '../cruBot';
import {roles} from '../../config.json'

async function validateIGN(ign:string) {
    const req = await fetch(`https://www.realmeye.com/player/${ign}`)
    const html = await req.text()

    const parser = new DOMParser()
    const parsedData = parser.parseFromString(html, 'text/html')

    if (parsedData.getElementsByClassName('player-not-found').length) {
        console.log('player', ign, ' not found')
    }

}

async function manualVerify(interaction:ChatInputCommandInteraction, client:CruBot) {
    
    // ack interaction
    await interaction.reply({components:[ 
        new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder({'content':'Starting manual verification'})
            )
    ], flags:[MessageFlags.IsComponentsV2,MessageFlags.Ephemeral]})

    // get data to verify
    const interactionOptions = interaction.options
    const member = interaction.options.getMember('member')
    const ign = interaction.options.getString('ign', true)
    const role1 = interaction.options.getString('role-1', false)
    const role2 = interaction.options.getString('role-2', false)

    // check if valid ign
    await validateIGN(ign)
}

/**
 * /realmeyeverificationpanel 
 * * sends a raider self verification panel to the current channel.
 */
const realmeyeverificationpanel: Command = {
    data: (new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verification commands.')
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('panel')
                .setDescription('Sends a realmEye verification panel to current channel.')
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('manual')
                .setDescription('Manual verification with optional role assignment')
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName('user')
                        .setDescription('Member to verify.')
                        .setRequired(true)
                )
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName('ign')
                        .setDescription('Member\'s in game name.')
                        .setRequired(true)
                )
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName('role-1')
                        .setDescription('Optional roles to verify member with.')
                        .setRequired(false)
                        .setChoices(
                            { 'name':'Raider', 'value': roles.raider},
                            { 'name':'Veteran', 'value': roles.veteran},
                        )
                        
                )      
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName('role-2')
                        .setDescription('Optional roles to verify member with.')
                        .setRequired(false)
                        .setChoices(
                            { 'name':'Veteran', 'value': roles.veteran},
                        )
                )      
        )
    ),
    async execute(interaction: ChatInputCommandInteraction, client:CruBot) { 
        const command = interaction.options.getSubcommand(true)
        if (command === 'manual') await manualVerify(interaction, client)
    }
}

export default realmeyeverificationpanel