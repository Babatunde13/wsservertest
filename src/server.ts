import express, { Application } from 'express';
import http from 'http';
import authRouter from './routers/authRouter';
import createWebSocketServer from './wsServer';


const createServer = (app: Application) => {
    app.use(express.json());
    const server = http.createServer(app);
    createWebSocketServer(server);
    app.use('/auth', authRouter);

    return server;
};

export default createServer;
