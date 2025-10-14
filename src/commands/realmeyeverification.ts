import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, TextChannel, ButtonBuilder, ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, SectionBuilder, ActionRowBuilder, ActionRow, ButtonStyle, Emoji, FileBuilder, AttachmentBuilder, MessagePayload, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, SlashCommandRoleOption, SlashCommandUserOption, SlashCommandStringOption, Interaction, GuildMember, TextDisplayComponent, messageLink, User, Role } from 'discord.js';
import Command from '../classes/Command';
import { cruBot } from '../cruBot';
import {roles} from '../../config.json'
import * as cheerio from 'cheerio'
import { Raider } from '../classes/Raider';

/**
 * Checks if the given IGN is found on realmEye
 * @param ign in game name
 * @returns bool: was the user found on realmEye?
 */
async function _isValidIGN(ign:string):Promise<boolean> {
    const req = await fetch(`https://www.realmeye.com/player/${ign}`)
    const html = await req.text()
    const $ = await cheerio.load(html)
    const playerNotFound = $('.player-not-found').text()
    if (playerNotFound) return false
    return true
}


/**
 * Process state update shortcut
 * @param interaction current interaction
 * @param content content to send in message
 */
async function _processReply(interaction:ChatInputCommandInteraction, content:string) {
    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(content)
        )
    if (interaction.replied) await interaction.editReply({components:[container], flags:MessageFlags.IsComponentsV2})
    else await interaction.reply({components:[container], flags:[MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})
}


async function manualVerify(interaction:ChatInputCommandInteraction) {
    
    // acknowledge interaction
    await _processReply(interaction, 'Starting manual verification')
    
    // get data from interaction
    const interactionOptions = interaction.options
    const user = interaction.options.getUser('user')!
    const ign = interactionOptions.getString('ign', true)
    const _optionRole1 = interaction.options.getString('role-1', false)
    const _optionRole2 = interaction.options.getString('role-2', false)

    // check if valid ign
    const validIGN = await _isValidIGN(ign)
    validIGN ? await _processReply(interaction, `IGN: \`${ign}\` valid`) : async()=> {

        await interaction.editReply({components:[new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent('### ⚠️ Verification Error.')
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(true)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Could not find IGN on realmEye\n- Member: <@${user.id}>\n- IGN: \`${ign}\``)
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(true)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Is the IGN is spelled correctly?`)
            )
        ], flags:MessageFlags.IsComponentsV2})
        return
    }    

    // get member and add roles if any
    const member = await cruBot._guild?.members.fetch(user.id) as GuildMember
    const roles = []
    if (_optionRole1) {
        const role = await cruBot._guild?.roles.fetch(_optionRole1)
        if (role instanceof Role) roles.push(role)
    }
    if (_optionRole2) {
        const role = await cruBot._guild?.roles.fetch(_optionRole2)
        if (role instanceof Role) roles.push(role)
    }

    // assign member roles if any
    if (roles.length) {
        await _processReply(interaction, 'Assigning roles.')
        await member.roles.add(roles)
        await _processReply(interaction, 'Roles assigned.')
    }

    // add new verified member to database
    await _processReply(interaction, 'Adding member to database.')
    await new Raider(ign, user.id).saveToDB(cruBot)
    await _processReply(interaction, 'Added member to database.')




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
                            { 'name':'Raider', 'value': '1423899658459152396'},
                            { 'name':'Veteran', 'value': '1423899658459152396'},
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
    async execute(interaction: ChatInputCommandInteraction) { 
        const command = interaction.options.getSubcommand(true)
        if (command === 'manual') await manualVerify(interaction)
    }
}

export default realmeyeverificationpanel