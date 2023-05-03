import { BaseModelClient } from './base.model.client'

export interface MessageClient extends BaseModelClient {
    _id: string
    chat: string
    sender: string
    text: string
    hasMedia: boolean
    media: string[]
    status: 'sent' | 'delivered' | 'read'
}
