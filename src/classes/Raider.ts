import { underline } from "discord.js"
import { CruBot } from "../cruBot"

type PartialRaiderData = {
    ign:string|undefined,
    userID:string|undefined,
}

export class Raider {
    
    ign:string
    id:string

    constructor(ign:string, userID:string) {
        this.ign = ign
        this.id = userID
    }
    
    async saveToDB(client:CruBot){
        await client._db.save(this.id, this, 'users')
    }
}