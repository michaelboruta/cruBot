#!/usr/local/bin/ts-node-dev index.ts

import { Interaction} from "discord.js";
import { cruBot } from "./cruBot";
import { interactionRouter } from "./interactions/interactionRouter";

cruBot.on('clientReady', async() => {
    console.log(`cruBot ready!`)
    // fetch guild
    cruBot._guild = await cruBot.guilds.fetch(cruBot._config.guildId)
})

cruBot.on('interactionCreate', async (interaction: Interaction) => {
    await interactionRouter(interaction, cruBot)
});

cruBot.login(cruBot._config.token)


