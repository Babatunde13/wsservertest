import { BaseModelClient } from './base.model.client'

export enum Role {
    Admin = 'admin',
    User = 'user'
}

export interface UserClient extends BaseModelClient {
    _id: string
    name: string
    email: string
    username: string
    password: string
    role: Role
    created: number
    updated: number
}
