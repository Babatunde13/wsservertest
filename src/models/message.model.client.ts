import { BaseModelClient } from './base.model.client'

export interface MessageClient extends BaseModelClient {
    _id: string
    chat: string
    sender: string
    receiver: string
    text: string
    hasMedia: boolean
    media: string[]
}
