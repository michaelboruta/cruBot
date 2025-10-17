import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, TextChannel, ButtonBuilder, ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, SectionBuilder, ActionRowBuilder, ActionRow, ButtonStyle, Emoji, FileBuilder, AttachmentBuilder, MessagePayload, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, SlashCommandRoleOption, SlashCommandUserOption, SlashCommandStringOption, Interaction, GuildMember, TextDisplayComponent, messageLink, User, Role, SimpleContextFetchingStrategy } from 'discord.js';
import Command from '../classes/Command';
import { CruBot } from '../cruBot';
import * as cheerio from 'cheerio'
import { Raider } from '../classes/Raider';
import {roles} from '../../config.json'
import { verifyManual } from './verify/verifyManual';
import { selfVerify } from './verify/verifySelf';



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

async function _isIGNtaken(ign:string, client:CruBot) {
    const dBiterator = client._db.usersDB.iterator?.(',')
    if (!dBiterator) { return undefined}
    else for await (const value of dBiterator) {
        // value = [key, value]
        const raider = value[1] as Raider
        if (raider.ign === ign) return raider
    }
    return undefined
}



/**
 * /realmeyeverificationpanel 
 * * sends a raider self verification panel to the current channel.
 */
const verify: Command = {
    
    data: (new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verification commands.')
    
        // realmeye raider self verification panel
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('panel')
                .setDescription('Sends a realmEye verification panel to current channel.')
        )
    
        // staff manual verification command
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
        if (command === 'manual') await verifyManual(interaction, client)
        if (command === 'panel') await selfVerify(interaction, client)

    }
}

export default verify