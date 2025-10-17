import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, FileBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import path from 'node:path'
import fs from 'node:fs'
import Canvas from '@napi-rs/canvas'
export class VerifySelfContainer extends ContainerBuilder {
    
    constructor(){ super() }
    
    private async headerImage() {
        const fileName = 'realmEyeVerification.png'
        const headerImagePath = path.join(__dirname, '../../../img/', fileName)
        const rawHeaderBuff   = fs.readFileSync(headerImagePath)
        
        const canvas  = Canvas.createCanvas(500,75)
        const context = canvas.getContext('2d')
        
        const loadedHeaderImage = await Canvas.loadImage(rawHeaderBuff)
        context.drawImage(loadedHeaderImage, 0, 0)

        const encodedImage = await canvas.encode('png')
        const attachment = new AttachmentBuilder(encodedImage, {'name':fileName})
    
        return {
            file:attachment,
            fileName:fileName
        }

    }

    private async reqsImage() {
        const fileName = 'reqs.png'
        const imagePath = path.join(__dirname, '../../../img/', 'reqs.png')
        const imageBuff   = fs.readFileSync(imagePath)
        
        const canvas  = Canvas.createCanvas(500,70)
        const context = canvas.getContext('2d')
        
        const loadedImage = await Canvas.loadImage(imageBuff)
        context.drawImage(loadedImage, 0, 0)

        const encodedImage = await canvas.encode('png')
        const attachment = new AttachmentBuilder(encodedImage, {'name':fileName})
    
        return {
            file:attachment,
            fileName:fileName
        }

    }

    async _build() {
        const headerImage = await this.headerImage()
        const reqsImage   = await this.reqsImage()

        this.addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(new MediaGalleryItemBuilder({'media':{'url':`attachment://${headerImage.fileName}`}}))
        )
        this.addSeparatorComponents( new SeparatorBuilder({'divider':true, 'spacing':SeparatorSpacingSize.Small}))
        this.addTextDisplayComponents( new TextDisplayBuilder({'content':'### Welcome to Holy Crusaders!'}))
        this.addSeparatorComponents( new SeparatorBuilder({'divider':true, 'spacing':SeparatorSpacingSize.Small}))
        this.addTextDisplayComponents( new TextDisplayBuilder({'content':'- Before accessing our server, you will need to verify your Realm Eye profile with our bot.\n- To be elegible, you need to meet the minimum verification requirements listed below.'}))
        this.addSeparatorComponents( new SeparatorBuilder({'divider':true, 'spacing':SeparatorSpacingSize.Small}))
        this.addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(new MediaGalleryItemBuilder({'media':{'url':`attachment://${reqsImage.fileName}`}}))
        )
        this.addSeparatorComponents( new SeparatorBuilder({'divider':true, 'spacing':SeparatorSpacingSize.Small}))
        this.addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>()
            .setComponents( new ButtonBuilder().setCustomId('verifySelf').setLabel('Begin Verification').setStyle(ButtonStyle.Success))
        )
        return {
            components:[this],
            files:[reqsImage.file, headerImage.file]
        }
    }
}