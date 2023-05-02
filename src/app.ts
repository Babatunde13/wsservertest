import express from 'express'
import createServer from './server'
import envs from './envs'
import { connectToDB } from './config/database'

const startSever = async () => {
    const dbConnection = await connectToDB(envs.MONGO_URI)
    if (dbConnection.error) {
        process.exit(1)
    }
    const app = express()
    
    const server = createServer(app)

    server.listen(envs.PORT, async () => {
        console.log(`Server is listening on port ${envs.PORT}`)
    })
}

startSever()
