import { config } from 'dotenv'

config()

interface EnvSchema {
    [key: string]: {
        required: boolean,
        type: 'string' | 'number' | 'object',
        default?: string | number | object
    }
}

interface Env {
    [key: string]: string | number | object | undefined
}

const envs = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || '',
    FRONTEND_URL: process.env.FRONTEND_URL || '',
    secret: process.env.SECRET || ''
}

const schema: EnvSchema = {
    PORT: {
        required: true,
        type: 'number',
        default: 5001,
    },
    MONGO_URI: {
        required: true,
        type: 'string',
    },
    FRONTEND_URL: {
        required: true,
        type: 'string',
    },
    secret: {
        required: true,
        type: 'string',
    }
}



const validateEnvs = (
    schema: EnvSchema,
    envs: Env
) => {
    const missingEnvs = Object.entries(schema).filter(([key, value]) => {
        if (typeof value.default !== 'undefined') {
            envs[key] = envs[key] || value.default
        }
        if (value.type === 'number') {
            // try to convert to number
            const num = Number(envs[key])
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
