import { underline } from "discord.js"
import { CruBot } from "../cruBot"

type newRaiderData = {
    ign:string
    id:string
}

type raiderFromDB = {
    [dbkey:string]:{
        ign:string,
        id:string
    }
}


export class Raider {
    
    ign:string;
    id:string;

    constructor(data: newRaiderData | raiderFromDB) {
        const keys = Object.keys(data)
        if (keys.includes('ign')) {
            const dataWithType = data as newRaiderData
            this.ign = dataWithType.ign;
            this.id = dataWithType.id;
        }
        else {
            const dataWithType = data as raiderFromDB
            this.ign = dataWithType[keys[0]].ign
            this.id = dataWithType[keys[0]].id
        }        
    };

}