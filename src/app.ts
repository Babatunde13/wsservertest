import express from 'express';
import createServer from './server';
import envs from './envs';

const app = express();

const server = createServer(app);

server.listen(envs.PORT, () => {
    console.log('Server is listening on port 3000');
});
