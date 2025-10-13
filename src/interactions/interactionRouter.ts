import { ButtonInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { CruBot } from "../cruBot";

/**
 * slash command execution interaction 
 */
async function slashCommand(interaction:ChatInputCommandInteraction, crubot:CruBot) {
    const command = crubot.commands?.get(interaction.commandName)
    command ? command.execute(interaction, crubot) : {}
    return
}

/**
 * Main interaction router. 
 * - Interactions passes though here first.
 * - Interactions get routed by interaction type.
 */
export async function interactionRouter(interaction:Interaction, crubot:CruBot) {
    if (interaction instanceof ChatInputCommandInteraction) { slashCommand(interaction, crubot) }
    else if (interaction instanceof ButtonInteraction) {  }
}