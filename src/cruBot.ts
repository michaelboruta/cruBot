import { Client, Collection, GatewayIntentBits, Guild, REST, Routes, TextChannel } from "discord.js";
import Command from "./classes/Command";
import path from 'node:path'
import fs from 'node:fs'
import config from '../config.json'
import { Db } from "./classes/Db";

type Config = {
	"token": string,
	"clientId": string,
	"guildId": string,
	"serverChannels": {
		"raider":string,
		"veteran":string,
		"verification":string
	}
}
export class CruBot extends Client {

    commands: Collection<string, Command> | undefined
    config:Config
    _guild:Guild|undefined
    _guildChannels: {
        'raiding': {
            'raider':TextChannel,
            'veteran':TextChannel
        },
        'verification':TextChannel
    } | undefined
    _db:Db
    
    constructor(){
        super({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]})
        this.config = config
        this._db = new Db()
        const commandsPath = path.join(__dirname, 'commands')

        // set and deploy commands
        const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
        this.commands = new Collection<string, Command>();
        const commandsObj:object[] = [];

        // get commands from ../commands/*.ts
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const commandModule = require(filePath);
            const command: Command = commandModule.default;

            if ('data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command);
                commandsObj.push(command.data.toJSON())
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }

        const rest = new REST({ version: '10' }).setToken(config.token);

        (async () => {
            try {
                console.log(`Refreshing ${commandsObj.length} (/) command(s).`);
                await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: {} },
                );
                const data: any = await rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: commandsObj },
                );
                console.log(`Refreshed ${data.length} (/) command(s).`);
            } catch (error) {
                console.error(error);
            }
        })();
        // (async () => {
        //     try {
        //         console.log(`Refreshing ${this.commands?.size} (/) command(s).`);
        //         const data: any = await rest.put(
        //             Routes.applicationGuildCommands(config.clientId, config.guildId),
        //             { body: this.commands },
        //         );

        //         console.log(`Refreshed ${data} (/) command(s).`);
        //         console.log(`Refreshed ${data.length} (/) command(s).`);
        //     } catch (error) {
        //         console.error(error,'');
        //     }
        // })();
        // (async () => {
        //     console.log('fetching guild')
        //     // set guild
        //     this._guild = await this.guilds.fetch(config.guildId)
        //     if (!this._guild) {
        //         console.log('Failed to set guild. check config')
        //         return
        //     }

        //     console.log('fetching channels')
        //     const verification = await this._guild.channels.fetch(config.serverChannels.verification) as TextChannel
        //     const raider = await this._guild.channels.fetch(config.serverChannels.raider) as TextChannel
        //     const veteran = await this._guild.channels.fetch(config.serverChannels.veteran) as TextChannel
        //     if (!verification || !raider || !veteran) {
        //         console.log('Could not set a channel. check config')
        //         return
        //     }

        //     // set values
        //     this._guildChannels = {
        //         'raiding': {
        //             'raider':raider,
        //             'veteran':raider
        //         },
        //         'verification':verification
        //     }
        // })();

        
    }
}

export const cruBot = new CruBot()