import { IEventPayload } from '../types/ws.types'

interface SendMessage {
    chat: string
    text: string
    hasMedia: boolean
    media: string[]
}

interface FetchMessages {
    chat: string
    page?: number
    limit?: number
}

interface CreateChat {
    name: string
    picture?: string
    users: string[]
    isGroup: boolean
}

export type SendMessagePayload = IEventPayload<SendMessage>
export type DeleteMessagePayload = IEventPayload<{ messageId: string }>
export type UpdateMessagePayload = IEventPayload<Partial<SendMessage> & { messageId: string, chat: string }>
export type FetchMessagesPayload = IEventPayload<FetchMessages>
export type ReadMessagePayload = IEventPayload<{ messageId: string, chat: string }>
export type CreateChatPayload = IEventPayload<CreateChat>
