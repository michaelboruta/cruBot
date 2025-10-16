#!/usr/local/bin/ts-node-dev index.ts

import { Interaction} from "discord.js";
import { cruBot } from "./cruBot";
import { interactionRouter } from "./interactions/interactionRouter";

cruBot.on('clientReady', async() => {
    // fetch guild
    cruBot._guild = await cruBot.guilds.fetch(cruBot._config.guildId)
    // fetch roles
    const roles = await cruBot._guild.roles.fetch()
    roles.forEach(role => {
        if (role.name === 'Raider') cruBot._roles.set('raider', role)
        if (role.name === 'Veteran') cruBot._roles.set('veteran', role)
    });
    console.log(`cruBot ready!`)
})

cruBot.on('interactionCreate', async (interaction: Interaction) => {
    await interactionRouter(interaction, cruBot)
});

cruBot.login(cruBot._config.token)


