import { Schema } from 'mongoose'
import { BaseModel, ModelAPI } from './base.model.server'
import { MessageClient } from './message.model.client'

export interface IMessage extends ModelAPI<MessageClient> {}
const messageModel = new BaseModel<IMessage, MessageClient>({
    name: 'Message',
    schema: {
        text: String,
        chat: {
            type: Schema.Types.ObjectId,
            ref: 'Chat'
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        hasMedia: Boolean,
        media: [String],
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent'
        }
    },
    toJSON(message) {
        return {
            _id: message._id.toString(),
            text: message.text,
            chat: message.chat.toString(),
            sender: message.sender.toString(),
            receiver: message.receiver.toString(),
            hasMedia: message.hasMedia,
            media: message.media,
            status: message.status,
        }
    },
})

export default messageModel
