import { Schema } from 'mongoose'
import { BaseModel, ModelAPI } from './base.model.server'
import { ChatClient } from './chat.model.client'

export interface IChat extends ModelAPI<ChatClient> {}
const chatModel = new BaseModel<IChat, ChatClient>({
    name: 'Chat',
    schema: {
        name: String,
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        isGroup: Boolean,
    },
    toJSON(chat) {
        return {
            _id: chat._id.toString(),
            name: chat.name,
            users: chat.users.map(user => user.toString()),
            isGroup: chat.isGroup,
        }
    },
})

export default chatModel
