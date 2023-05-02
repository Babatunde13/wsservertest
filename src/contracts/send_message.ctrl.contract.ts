import { IEventPayload } from '../types/ws.types'

interface SendMessage {
    chat: string
    receiver: string
    text: string
    hasMedia: boolean
    media: string[]
}

interface FetchMessages {
    chat: string
    page?: number
    limit?: number
}

export type SendMessagePayload = IEventPayload<SendMessage>
export type DeleteMessagePayload = IEventPayload<{ messageId: string }>
export type UpdateMessagePayload = IEventPayload<Partial<SendMessage> & { messageId: string, chat: string }>
export type FetchMessagesPayload = IEventPayload<FetchMessages>
