import express, { Application } from 'express'
import http from 'http'
import createWebSocketServer from './wsServer'
import router from './routers/index.router'

const createServer = (app: Application) => {
    app.use(express.json())
    const server = http.createServer(app)
    createWebSocketServer(server)
    app.use('/', router)

    return server
}

export default createServer
