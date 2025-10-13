#!/usr/local/bin/ts-node-dev index.ts

import { ButtonInteraction, ChatInputCommandInteraction, Interaction, InteractionType, ModalSubmitInteraction } from "discord.js";
import { cruBot } from "./cruBot";
import { interactionRouter } from "./interactions/interactionRouter";

cruBot.on('clientReady', async() => {
    console.log(`cruBot ready!`)
})

cruBot.on('interactionCreate', async (interaction: Interaction) => {
    await interactionRouter(interaction, cruBot)
});

cruBot.login(cruBot.config.token)


