type PartialRaiderData = {
    ign:string|undefined,
    userID:string|undefined,
    stats:string[]|undefined,
}

export class Raider {
    ign:string
    userID:string
    stats:string[]

    constructor() {
        this.ign = ''
        this.userID = ''
        this.stats = []
    }

    
}