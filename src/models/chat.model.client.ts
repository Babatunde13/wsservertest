import { BaseModelClient } from './base.model.client'

export interface ChatClient extends BaseModelClient {
    _id: string
    name: string
    users: string[]
    isGroup: boolean
}
