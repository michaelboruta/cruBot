import { Channel, DMChannel, Message, TextChannel } from 'discord.js'
import { CruBot } from '../cruBot'

export type messageData = {
    message:string,
    channel:string
}
export async function fetchImageFromMessage(cruBot:CruBot,messageData:messageData) {
    const channel = (await cruBot.channels.fetch(messageData.channel)) as DMChannel | TextChannel
    const message = (await channel.messages.fetch(messageData.message)) as Message
    let image = ''
    message.attachments.forEach( attachment => {
        image = attachment['attachment'].toString()
    })  
    if (!image) {
        console.log('could not process background reactions image from dm channel')
        return
    }
    return image
}