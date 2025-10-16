import Keyv from 'keyv';
import KeyvSqlite from '@keyv/sqlite';
import { Raider } from './Raider';

type verificationData = {
    ign:string,
    verificationCode:string
}

type userData = {
    ign:string
}


export class Db {
    private sqliteStore:KeyvSqlite
    verificationDB:Keyv
    usersDB:Keyv
    
    constructor() {
        this.sqliteStore = new KeyvSqlite({ uri: 'sqlite://../db.sqlite' })
        this.verificationDB = new Keyv<string>({ store: this.sqliteStore, namespace: 'verification'})
        this.usersDB = new Keyv<string>({ store: this.sqliteStore, namespace: 'users' });
    }

    async save( key:string, value:any, dbName: 'verification'|'users'|'headcounts'|'headcountConfirmation' ) {
        if (dbName === 'verification') await this.verificationDB.set(key, value)
        else if (dbName === 'users') await this.usersDB.set(key, value)
    }
    async fetch( key:string, dbName: 'verification'|'users'|'headcounts'|'headcountConfirmation' ) {
        if (dbName === 'verification') return (await this.verificationDB.get(key))
        else if (dbName === 'users') return (await this.usersDB.get(key))
    }
    async delete( key:string, dbName: 'verification'|'users'|'headcounts'|'headcountConfirmation' ) {
        if (dbName === 'verification') await this.verificationDB.delete(key)
        else if (dbName === 'users') await this.usersDB.delete(key)
    }
    async findMemberByIGN(ign:string):Promise<Raider|undefined> {
        const users = this.usersDB?.iterator?.(undefined)!
        for await(const user of users) {
            // array is [[k, {v}]]
            const raider = user[1] as Raider
            if (raider.ign === ign) return user
        }   
        return undefined
    }
}
