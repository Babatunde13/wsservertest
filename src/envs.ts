import { config } from 'dotenv'

config()

const envs: { [key: string]: string | number | undefined } = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5001',
}
const schema = {
    PORT: {
        required: true,
        type: 'number',
        default: 5000,
    },
    MONGO_URI: {
        required: true,
        type: 'string',
    },
    FRONTEND_URL: {
        required: true,
        type: 'string',
    },
}

const validateEnvs = (
    schema: { [key: string]: { required: boolean, type: any, default?: any } },
    envs: { [key: string]: string | number | undefined }
) => {
    const missingEnvs = Object.entries(schema).filter(([key, value]) => {
        if (typeof value.default !== 'undefined') {
            value = envs[key] || value.default
        }
        if (value.type === 'number') {
            // try to convert to number
            const num = Number(process.env[key])
            if (isNaN(num)) {
                return true
            }

            return false
        }
        if (value.required && !envs[key]) {
            return true
        }
        return false
    })

    if (missingEnvs.length) {
        throw new Error(`Missing env variables: ${missingEnvs.map(([key]) => key).join(', ')}`)
    }
}

validateEnvs(schema, envs)

export default envs
